import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Exhibition from "../models/exhibition.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

// @desc    Get user profile
// @route   GET /api/users/profile/:username
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: "Invalid username format" });
    }

    const user = await User.findOne({ username: username.toLowerCase() })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: id } });
      await User.findByIdAndUpdate(id, { $addToSet: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnFollowUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get suggested users
// @route   GET /api/users/suggested
// @access  Private
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get users that the current user is not following
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, userId]
      }
    })
    .select("username fullName profileImage bio followers")
    .limit(10)
    .lean();

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error in getSuggestedUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get user followers
// @route   GET /api/users/followers/:id
// @access  Private
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .populate("followers", "username fullName profileImage bio")
      .select("followers")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    console.error("Error in getFollowers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get user following
// @route   GET /api/users/following/:id
// @access  Private
export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .populate("following", "username fullName profileImage bio")
      .select("following")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.following);
  } catch (error) {
    console.error("Error in getFollowing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/update/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { fullName, email, username, password, bio } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email) {
      const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}.[^\s@]{2,6}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      
      const emailExists = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: "Username must be 3-30 characters long and can only contain letters, numbers, and underscores" });
      }

      const usernameExists = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: userId }
      });

      if (usernameExists) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ error: "Bio cannot exceed 500 characters" });
    }

    if (fullName && (fullName.length < 2 || fullName.length > 50)) {
      return res.status(400).json({ error: "Full name must be between 2 and 50 characters" });
    }

    // Handle profile image upload
    let profileImageUrl = user.profileImage;
    if (req.files?.profileImage) {
      try {
        const result = await cloudinary.uploader.upload(req.files.profileImage.path, {
          folder: "threadless_profile_pics",
          width: 500,
          height: 500,
          crop: "fill",
        });
        profileImageUrl = result.secure_url;
      } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(400).json({ error: "Error uploading profile image" });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName: fullName || user.fullName,
          email: email ? email.toLowerCase() : user.email,
          username: username ? username.toLowerCase() : user.username,
          profileImage: profileImageUrl,
          bio: bio || user.bio,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .lean();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Search users
// @route   GET /api/users/search/:query
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.length > 50) {
      return res.status(400).json({ error: "Invalid search query" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } }
      ]
    })
    .select("-password")
    .limit(10)
    .lean();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get enrolled exhibitions
// @route   GET /api/users/enrolled-exhibitions
// @access  Private
export const getEnrolledExhibitions = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .populate("enrolledExhibitions")
      .select("enrolledExhibitions")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.enrolledExhibitions);
  } catch (error) {
    console.error("Error in getEnrolledExhibitions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Enroll in exhibition
// @route   POST /api/users/enroll/:id
// @access  Private
export const enrollExhibition = async (req, res) => {
  try {
    const { id: exhibitionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const [user, exhibition] = await Promise.all([
      User.findById(userId),
      Exhibition.findById(exhibitionId)
    ]);

    if (!user || !exhibition) {
      return res.status(404).json({ error: "User or Exhibition not found" });
    }

    if (user.enrolledExhibitions.includes(exhibitionId)) {
      return res.status(400).json({ error: "Already enrolled in this exhibition" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledExhibitions: exhibitionId }
    });

    const newNotification = new Notification({
      from: userId,
      to: exhibition.user,
      type: "exhibition_enroll",
      exhibition: exhibitionId
    });
    await newNotification.save();

    res.status(200).json({ message: "Successfully enrolled in exhibition" });
  } catch (error) {
    console.error("Error in enrollExhibition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Unenroll from exhibition
// @route   POST /api/users/unenroll/:id
// @access  Private
export const unenrollExhibition = async (req, res) => {
  try {
    const { id: exhibitionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const [user, exhibition] = await Promise.all([
      User.findById(userId),
      Exhibition.findById(exhibitionId)
    ]);

    if (!user || !exhibition) {
      return res.status(404).json({ error: "User or Exhibition not found" });
    }

    if (!user.enrolledExhibitions.includes(exhibitionId)) {
      return res.status(400).json({ error: "Not enrolled in this exhibition" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { enrolledExhibitions: exhibitionId }
    });

    res.status(200).json({ message: "Successfully unenrolled from exhibition" });
  } catch (error) {
    console.error("Error in unenrollExhibition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/deleteAccount
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user's posts
    await Post.deleteMany({ user: userId });

    // Delete user's comments
    await Comment.deleteMany({ user: userId });

    // Delete user's notifications
    await Notification.deleteMany({
      $or: [{ from: userId }, { to: userId }]
    });

    // Remove user from others' followers/following lists
    await User.updateMany(
      { $or: [{ followers: userId }, { following: userId }] },
      { 
        $pull: { 
          followers: userId,
          following: userId
        }
      }
    );

    // Delete user's profile and cover images from Cloudinary
    if (user.profileImage) {
      const publicId = user.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    if (user.coverImage) {
      const publicId = user.coverImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    res.clearCookie("jwt");
    res.status(200).json({ message: "Account successfully deleted" });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
