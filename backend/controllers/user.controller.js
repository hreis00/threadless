import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// @desc    Get user profile
// @route   POST /api/users/profile/:username
// @access  Private
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Follow or Unfollow user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({ message: "Unfollowed user" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "follow",
      });
      await newNotification.save();

      res.status(200).json({ message: "Followed user" });
    }
  } catch (error) {
    console.log("Error following user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get suggested users
// @route   POST /api/users/suggested
// @access  Private
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId, "following");
    const usersToExclude = usersFollowedByMe.following.concat(userId);

    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $nin: usersToExclude } } },
      { $sample: { size: 10 } },
      { $limit: 4 },
      { $project: { password: 0 } },
    ]);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error getting suggested users:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $nin: userId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("Error getting all users:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Search users
// @route   GET /api/users/search/:query
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const query = req.params.query;
    const userId = req.user._id;
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .where({ _id: { $nin: userId } })
      .select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error searching users:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   POST /api/users/update
// @access  Private
export const updateUserProfile = async (req, res) => {
  const {
    isAdmin,
    fullName,
    username,
    email,
    currentPassword,
    newPassword,
    bio,
    link,
  } = req.body;

  let { profileImage, coverImage } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImage) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImage);
      profileImage = uploadedResponse.secure_url;
    }
    if (coverImage) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImage);
      coverImage = uploadedResponse.secure_url;
    }

    user.isAdmin = isAdmin || user.isAdmin;
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    user = await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error updating user profile:", error.message);
    res.status(500).json({ error: error.message });
  }
};
