import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply general rate limiting to all routes
router.use(apiLimiter);

router.get("/", protectRoute, getNotifications);
router.post("/mark-as-read/:id", protectRoute, markAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
