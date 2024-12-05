import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "lax", // Changed from strict to lax for development
    secure: process.env.NODE_ENV === "production", // Only use secure in production
    path: "/", // Explicitly set the path
  });
};
