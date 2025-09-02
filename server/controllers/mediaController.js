import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Media from "../models/Media.js";
import dotenv from "dotenv";

dotenv.config();

// AWS S3 Client Setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 📌 Upload Media to AWS S3
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
    
    const fileBuffer = req.file.buffer;
    const fileName = `${process.env.AWS_BUCKET_FOLDER}${Date.now()}-${req.file.originalname}`;
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    // Ensure `req.user.id` exists (comes from auth middleware)
    const uploadedBy = req.user;
    if (!uploadedBy) return res.status(401).json({ error: "Unauthorized!" });
    const commmand = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: fileName });
    const signedUrl = await getSignedUrl(s3,commmand);

    // Save metadata in MongoDB
    const media = new Media({
      url: signedUrl,
      key: fileName,
      type: req.file.mimetype.startsWith("image") ? "image" : "video",
      uploadedBy
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
