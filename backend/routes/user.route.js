import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
  followUnFollowUser,
  getAllUsers,
  getSuggestedUsers,
  searchUsers,
  getUserProfile,
  updateUser,
  enrollExhibition,
  unenrollExhibition,
  deleteAccount,
  getFollowers,
  getFollowing,
  getEnrolledExhibitions
} from "../controllers/user.controller.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { sanitizeInput } from "../middleware/sanitizeInput.js";

const router = express.Router();

// Apply rate limiting and sanitization to all routes
router.use(apiLimiter);
router.use(sanitizeInput);

router.get("/", protectRoute, getAllUsers);
router.get("/search/:query", protectRoute, searchUsers);
router.route("/profile/:username").get(protectRoute, getUserProfile);
router.route("/suggested").get(protectRoute, getSuggestedUsers);
router.route("/followers/:id").get(protectRoute, getFollowers);
router.route("/following/:id").get(protectRoute, getFollowing);
router.get("/enrolled-exhibitions", protectRoute, getEnrolledExhibitions);
router.route("/enroll/:id").post(protectRoute, enrollExhibition);
router.route("/follow/:id").post(protectRoute, followUnFollowUser);
router.route("/update/:id").put(protectRoute, updateUser);
router.route("/unenroll/:id").post(protectRoute, unenrollExhibition);
router.delete("/deleteAccount", protectRoute, deleteAccount);

export default router;
