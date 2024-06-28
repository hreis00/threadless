import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

// @desc    Search posts
// @route   GET /api/posts/search/:query
// @access  Private
export const searchPosts = async (req, res) => {
  try {
    const query = req.params.query;
    const userId = req.user._id;
    const posts = await Post.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { text: { $regex: query, $options: "i" } },
      ],
    }).where({ _id: { $nin: userId } });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error searching posts:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts/all
// @access  Private
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error getting posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log("Error getting post by ID:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts/create
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { name, description } = req.body;
    let { image } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!name && !image) {
      return res.status(400).json({ error: "Name and image is required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!image && req.file) {
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path);
      image = uploadedResponse.secure_url;
    }

    if (name && !image && req.file) {
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path);
      image = uploadedResponse.secure_url;
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      name,
      description,
      image,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.image) {
      const imageId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Create notification
// @desc    Comment a post
// @route   POST /api/posts/comment/:id
// @access  Private
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      user: userId,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error commenting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/like/:id
// @access  Private
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error liking/unliking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get liked posts
// @route   GET /api/posts/likes/:id
// @access  Private
export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error getting liked posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get following posts
// @route   GET /api/posts/following
// @access  Private
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error getting following posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get user posts
// @route   GET /api/posts/user/:username
// @access  Private
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Bookmark/Unbookmark a post
// @route   POST /api/posts/bookmark/:id
// @access  Private
export const bookmarkUnbookmarkPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userBookmarkedPost = post.bookmarks.includes(userId);

    if (userBookmarkedPost) {
      // Unbookmark post
      await Post.updateOne({ _id: postId }, { $pull: { bookmarks: userId } });
      await User.updateOne(
        { _id: userId },
        { $pull: { bookmarkedPosts: postId } }
      );

      const updatedBookmarks = post.bookmarks.filter(
        (id) => id.toString() !== userId.toString()
      );

      res.status(200).json(updatedBookmarks);
    } else {
      // Bookmark post
      post.bookmarks.push(userId);
      await User.updateOne(
        { _id: userId },
        { $push: { bookmarkedPosts: postId } }
      );
      await post.save();

      const notification = Notification({
        from: userId,
        to: post.user,
        type: "bookmark",
      });
      await notification.save();

      const updatedBookmarks = post.bookmarks;
      res.status(200).json(updatedBookmarks);
    }
  } catch (error) {
    console.log("Error bookmarking/unbookmarking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get bookmarked posts
// @route   GET /api/posts/bookmarks/:id
// @access  Private
export const getBookmarkedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookmarkedPosts = await Post.find({
      _id: { $in: user.bookmarkedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    console.log("Error getting bookmarked posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
