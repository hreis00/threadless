import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Exhibition from "../models/exhibition.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

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
      "-password -isAdmin"
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
      $and: [
        {
          $or: [
            { fullName: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
          ],
        },
        { isAdmin: { $nin: true } },
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
  } = req.body;

  let { profileImage, coverImage } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id != userId) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id != userId) {
      return res.status(400).json({ error: "Email already exists." });
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

    user = await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error updating user profile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Enroll user in an exhibition
// @route   POST /api/users/enroll/:id
// @access  Private
export const enrollExhibition = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const exhibition = await Exhibition.findById(id);
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    if (exhibition.enrolledUsers.includes(userId)) {
      return res.status(400).json({ error: "User is already enrolled" });
    }

    // Save the exhibition in the user's enrolledExhibitions field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.enrolledExhibitions.push(exhibition._id);
    await user.save();

    exhibition.enrolledUsers.push(userId);
    await exhibition.save();

    res
      .status(200)
      .json({ message: "User enrolled successfully in: " + exhibition.name });
  } catch (error) {
    console.log("Error enrolling user in exhibition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Unenroll user from an exhibition
// @route   POST /api/users/unenroll/:id
// @access  Private
export const unenrollExhibition = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const exhibition = await Exhibition.findById(id);
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    if (!exhibition.enrolledUsers.includes(userId)) {
      return res.status(400).json({ error: "User is not enrolled" });
    }

    // Remove the exhibition from the user's enrolledExhibitions field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.enrolledExhibitions = user.enrolledExhibitions.filter(
      (enrolledId) => enrolledId.toString() !== exhibition._id.toString()
    );
    await user.save();

    exhibition.enrolledUsers = exhibition.enrolledUsers.filter(
      (enrolledId) => enrolledId.toString() !== userId.toString()
    );
    await exhibition.save();

    res.status(200).json({
      message: "User unenrolled successfully from: " + exhibition.name,
    });
  } catch (error) {
    console.log("Error unenrolling user from exhibition:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get enrolled exhibitions
// @route   GET /api/users/enrolled-exhibitions
// @access  Private
export const getEnrolledExhibitions = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("enrolledExhibitions");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.enrolledExhibitions);
  } catch (error) {
    console.log("Error getting enrolled exhibitions:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/users/:id
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user by id and delete the account
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Post.deleteMany({ user: userId });
    await Comment.deleteMany({ user: userId });
    await Notification.deleteMany({ from: userId, to: { $ne: userId } });
    await Exhibition.deleteMany({ user: userId });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error deleting account:", error.message);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
