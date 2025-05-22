import express from "express";
import { createComment, getCommentsByVideo, addReply, deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a new comment
router.post("/", verifyJWT, createComment);

// Get all comments for a video
router.get("/video/:videoId", getCommentsByVideo);

// Add a reply to a comment
router.post("/:commentId/reply", verifyJWT, addReply);

// Delete a comment
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;
