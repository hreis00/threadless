import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  register,
  login,
  logout,
  getUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/me", protectRoute, getUser);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
