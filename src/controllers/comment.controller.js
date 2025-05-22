import { Comment } from "../models/comment.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { video, content } = req.body;
    const user = req.user._id;
    const comment = await Comment.create({ video, user, content });
    res.status(201).json(new ApiResponse(201, comment, "Comment created successfully"));
  } catch (error) {
    next(error);
  }
};

// Get all comments for a video
export const getCommentsByVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// Add a reply to a comment
export const addReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const user = req.user._id;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: { user, content } } },
      { new: true }
    ).populate("user", "username fullName avatar");
    if (!comment) {
      return next(new ApiError(404, "Comment not found"));
    }
    res.status(200).json(new ApiResponse(200, comment, "Reply added successfully"));
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const user = req.user._id;
    const comment = await Comment.findOneAndDelete({ _id: commentId, user });
    if (!comment) {
      return next(new ApiError(404, "Comment not found or not authorized"));
    }
    res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"));
  } catch (error) {
    next(error);
  }
};
