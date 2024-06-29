import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

// @desc    Comment a post
// @route   POST /api/comments/:id/comment
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

    const newComment = new Comment({
      text,
      user: userId,
      post: postId,
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    const newNotification = new Notification({
      from: userId,
      to: post.user,
      type: "comment",
    });

    await newNotification.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.log("Error commenting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get comments of a post
// @route   GET /api/comments/:id/comments
// @access  Private
export const getPostComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "_id username fullName profileImage",
      });

    if (!comments) {
      return res.status(404).json({ error: "Comments not found" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.log("Error getting comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:postId/comment/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findOneAndDelete({
      post: postId,
      _id: commentId,
    });

    const post = await Post.findById(postId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    post.comments.pull(comment._id);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
