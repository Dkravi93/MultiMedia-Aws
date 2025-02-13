import express from "express";
import multer from "multer";
import { uploadMedia, getMedia, deleteMedia } from "../controllers/mediaController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Multer Storage (Temporary, as AWS S3 will handle final storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/upload",protect, upload.single("file"), uploadMedia); // Upload media to AWS S3
router.get("/", getMedia); // Fetch media list
router.delete("/:key(*)", deleteMedia); // Delete media from AWS S3

export default router;
