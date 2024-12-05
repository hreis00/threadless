import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  deleteComment,
  getPostComments,
} from "../controllers/comment.controller.js";
import { apiLimiter, commentLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply general rate limiting to all routes
router.use(apiLimiter);

// Route to comment on a post with stricter limits
router.post("/:id", protectRoute, commentLimiter, commentPost);

// Route to delete a comment with stricter limits
router.delete("/:postId/:commentId", protectRoute, commentLimiter, deleteComment);

// Route to get comments of a post
router.get("/:id", protectRoute, getPostComments);

export default router;
