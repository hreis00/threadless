import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getAllUsers,
  getSuggestedUsers,
  getUserProfile,
  searchUsers,
  updateUserProfile,
  getEnrolledExhibitions,
  enrollExhibition,
  unenrollExhibition,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllUsers);
router.get("/search/:query", protectRoute, searchUsers);
router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/enrolled-exhibitions", protectRoute, getEnrolledExhibitions);
router.post("/enroll/:id", protectRoute, enrollExhibition);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUserProfile);
router.post("/unenroll/:id", protectRoute, unenrollExhibition);

export default router;
