import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;

    // Validate email format using regex with a maximum length
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}.[^\s@]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: "Username must be 3-30 characters long and can only contain letters, numbers, and underscores." });
    }

    // Validate fullName
    if (!fullName || fullName.length < 2 || fullName.length > 50) {
      return res.status(400).json({ error: "Full name must be between 2 and 50 characters." });
    }

    // Check for existing user with safe queries
    const existingUser = await User.findOne({ 
      $or: [
        { username: username },
        { email: email.toLowerCase() }
      ]
    }).select('username email').lean();

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already exists." });
      }
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ error: "Password must be between 6 and 128 characters." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      fullName: fullName.trim(),
      username: username.toLowerCase(),
      password: hashedPassword,
      email: email.toLowerCase(),
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImage: newUser.profileImage,
      coverImage: newUser.coverImage,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error logging out:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/user
// @access  Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const google = async (req, res) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}.[^\s@]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      generateTokenAndSetCookie(existingUser._id, res);
      return res.status(200).json({
        _id: existingUser._id,
        fullName: existingUser.fullName,
        username: existingUser.username,
        email: existingUser.email,
        followers: existingUser.followers,
        following: existingUser.following,
        profileImage: existingUser.profileImage,
        coverImage: existingUser.coverImage,
      });
    }

    // Generate a secure random password
    const generatePassword = await bcrypt.hash(Math.random().toString(36) + Date.now().toString(), 10);
    
    // Generate a unique username
    const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const username = `${baseUsername}${randomSuffix}`;

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      profileImage: googlePhotoUrl,
      fullName: name,
      password: generatePassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    return res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImage: newUser.profileImage,
    });
  } catch (error) {
    console.error("Error in Google login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
