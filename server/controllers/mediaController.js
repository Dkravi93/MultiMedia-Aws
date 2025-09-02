import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Media from "../models/Media.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static"; 

dotenv.config();

// AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Compress video with ffmpeg
const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-i", inputPath,
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "28",
      "-c:a", "aac",
      "-b:a", "128k",
      "-movflags", "+faststart",
      outputPath
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error(`FFmpeg failed with code ${code}`));
    });
  });
};

// Upload Media
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
    if (!req.user) return res.status(401).json({ error: "Unauthorized!" });

    const fileExt = path.extname(req.file.originalname);
    const fileName = `${process.env.AWS_BUCKET_FOLDER}${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const tempInput = `uploads/${Date.now()}-input${fileExt}`;
    const tempOutput = `uploads/${Date.now()}-output.mp4`;

    // Save uploaded buffer temporarily
    fs.writeFileSync(tempInput, req.file.buffer);

    let finalFilePath = tempInput;

    // If video → compress
    if (req.file.mimetype.startsWith("video")) {
      finalFilePath = await compressVideo(tempInput, tempOutput);
      fs.unlinkSync(tempInput); // remove raw input
    }

    // Upload compressed (or original) file to S3
    const fileBuffer = fs.readFileSync(finalFilePath);
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    }));

    // Cleanup
    if (fs.existsSync(finalFilePath)) fs.unlinkSync(finalFilePath);

    // Generate signed URL (valid 1 hour)
    const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: fileName });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Save metadata in DB
    const media = new Media({
      url: signedUrl,
      key: fileName,
      type: req.file.mimetype.startsWith("image") ? "image" : "video",
      uploadedBy: req.user,
    });

    await media.save();

    res.status(201).json({ message: "File uploaded successfully!", media });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "File upload failed!" });
  }
};

// 📌 Get All Uploaded Media
export const getMedia = async (req, res) => {
  try {
    const mediaList = await Media.find();
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to retrieve media!" });
  }
};

// 📌 Delete Media from AWS S3
export const deleteMedia = async (req, res) => {
  try {
    const { key } = req.params;
    if (!key) return res.status(400).json({ error: "File key is required!" });

    await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }));

    // Delete from MongoDB
    await Media.findOneAndDelete({ key });

    res.status(200).json({ message: "File deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "File deletion failed!" });
  }
};
