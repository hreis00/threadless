import express from "express";
import {
  createExhibition,
  deleteExhibition,
  getAllExhibitions,
  getEnrolledUsers,
  getExhibitionBySlug,
} from "../controllers/exhibition.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, getAllExhibitions);
router.get("/:slug", protectRoute, getExhibitionBySlug);
router.get("/:id/enrolled-users", protectRoute, getEnrolledUsers);
router.post("/create", protectRoute, createExhibition);
router.delete("/:id", protectRoute, deleteExhibition);

export default router;
