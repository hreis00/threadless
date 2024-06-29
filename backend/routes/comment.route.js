import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  deleteComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Route to comment on a post
router.post("/:id", protectRoute, commentPost);

// Route to delete a comment
router.delete("/:postId/:commentId", protectRoute, deleteComment);

// Route to get comments of a post
router.get("/:id", protectRoute, getPostComments);

export default router;
