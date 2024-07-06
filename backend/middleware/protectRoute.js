import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error("Unauthorized: No Token Provided");
    }

    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Unauthorized: Invalid Token");
  }
};

const getUserById = async (userId) => {
  try {
    return await User.findById(userId).select("-password");
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};
