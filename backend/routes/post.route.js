import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getAllPosts,
  createPost,
  likeUnlikePost,
  commentPost,
  deletePost,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
  searchPosts,
  bookmarkUnbookmarkPost,
  getBookmarkedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/search/:query", protectRoute, searchPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/bookmarks/:id", protectRoute, getBookmarkedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/bookmark/:id", protectRoute, bookmarkUnbookmarkPost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
