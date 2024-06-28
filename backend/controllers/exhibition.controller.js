import User from "../models/user.model.js";
import Exhibition from "../models/exhibition.model.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Create an exhibition
// @route   POST /api/exhibitions/create
// @access  Private
export const createExhibition = async (req, res) => {
  try {
    const { name, description } = req.body;
    let { image } = req.body;
    const userId = req.user._id.toString();

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Can't create an exhibition" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!name && !description && !image) {
      return res
        .status(400)
        .json({ error: "Name or description or image is required" });
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    const slug = name
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newExhibition = new Exhibition({
      user: userId,
      name,
      description,
      image,
      slug,
    });

    await newExhibition.save();
    res.status(201).json(newExhibition);
  } catch (error) {
    console.log("Error creating exhibition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Delete an exhibition
// @route   DELETE /api/exhibitions/:id
// @access  Private
export const deleteExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    // if (exhibition.user.toString() !== req.user._id.toString()) {
    //   return res
    //     .status(401)
    //     .json({ error: "You are not authorized to delete this exhibition" });
    // }

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Can't delete an exhibition" });
    }

    if (exhibition.image) {
      const imageId = exhibition.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageId);
    }

    await Exhibition.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Exhibition deleted successfully" });
  } catch (error) {
    console.log("Error deleting exhibition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get all exhibitions
// @route   GET /api/exhibitions/all
// @access  Private
export const getAllExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find().sort({ createdAt: -1 });

    if (exhibitions.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(exhibitions);
  } catch (error) {
    console.log("Error getting exhibitions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Retrieve a single exhibition
// @route   GET /api/exhibitions/:slug
// @access  Public
export const getExhibitionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const exhibition = await Exhibition.findOne({ slug });

    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    res.status(200).json(exhibition);
  } catch (error) {
    console.log("Error retrieving exhibition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get the list of users enrolled in an exhibition
// @route   GET /api/exhibitions/:id/enrolled-users
// @access  Private
export const getEnrolledUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const exhibition = await Exhibition.findById(id);

    if (!exhibition) {
      return res.status(404).json({ error: "Exhibition not found" });
    }

    const enrolledUsers = await User.find({
      enrolledExhibitions: exhibition._id,
    });

    res.status(200).json(enrolledUsers);
  } catch (error) {
    console.log("Error getting enrolled users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
