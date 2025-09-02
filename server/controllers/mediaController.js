import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Media from "../models/Media.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

dotenv.config();

// AWS S3 Client Setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Utility: Compress video before upload
const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-c:v libx264",
        "-preset fast",
        "-crf 28", // quality: 18-30 (lower = better quality, bigger size)
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart"
      ])
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
};

// 📌 Upload Media to AWS S3
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
    if (!req.user) return res.status(401).json({ error: "Unauthorized!" });

    const fileExt = path.extname(req.file.originalname);
    const fileName = `${process.env.AWS_BUCKET_FOLDER}${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const tempInput = `uploads/${Date.now()}-input${fileExt}`;
    const tempOutput = `uploads/${Date.now()}-output.mp4`;

    // Save incoming file temporarily
    fs.writeFileSync(tempInput, req.file.buffer);

    let finalFilePath = tempInput;

    // If video → compress it
    if (req.file.mimetype.startsWith("video")) {
      finalFilePath = await compressVideo(tempInput, tempOutput);
      fs.unlinkSync(tempInput); // remove original
    }

    const fileStream = fs.createReadStream(finalFilePath);

    // Stream upload (crash-proof)
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: req.file.mimetype,
      },
    });

    await upload.done();

    // Clean up compressed file
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);

    // Generate signed URL (valid for 1 hour)
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
    await Media.findOneAndDelete({ key });

    res.status(200).json({ message: "File deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "File deletion failed!" });
  }
};
