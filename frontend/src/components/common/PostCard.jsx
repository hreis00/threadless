import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
// import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatDate } from "../../utils/date";

const Post = ({ post }) => {
  const navigate = useNavigate();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedPostDate = formatDate(post.createdAt);
  const isBookmarked = post.bookmarks.includes(authUser._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: updatedLikes,
            };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: bookmarkPost, isPending: isBookmarking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/bookmark/${post._id}`, {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedBookmarks) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              bookmarks: updatedBookmarks,
            };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleBookmarkPost = () => {
    if (isBookmarking) return;
    bookmarkPost();
  };
  const handleDeletePost = () => {
    deletePost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div className="flex items-start gap-2 p-4 border-b border-gray-700 hover:bg-base-300">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <Link to={`/profile/${postOwner.username}`}>
            <img src={postOwner.profileImage || "/avatar-placeholder.png"} />
          </Link>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="flex gap-1 text-xs font-thin">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedPostDate}</span>
          </span>
          {/* Delete */}
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting && (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              )}

              {isDeleting && <LoadingSpinner size="sm" />}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <Link to={`/post/${post._id}`}>
            <div className="flex flex-col gap-2">
              <span className="py-2 text-lg font-bold">{post.name}</span>
              {post.description && <span>{post.description}</span>}
              <div>
                {post.image && (
                  <img
                    src={post.image}
                    className="object-contain border border-gray-700 rounded-lg h-80"
                    alt=""
                  />
                )}
              </div>
            </div>
          </Link>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center justify-around w-full gap-4">
            {/* Comment */}
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <FaComment className="w-4 h-4 group-hover:text-sky-400" />
              <span className="text-sm group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            {/* Like */}
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={handleLikePost}
            >
              {isLiking && <LoadingSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <FaHeart className="w-4 h-4 cursor-pointer group-hover:text-red-500" />
              )}
              {isLiked && !isLiking && (
                <FaHeart className="w-4 h-4 text-red-500 cursor-pointer " />
              )}

              <span
                className={`text-sm group-hover:text-red-500 ${
                  isLiked ? "text-red-500" : ""
                }`}
              >
                {post.likes.length}
              </span>
            </div>
            {/* Bookmark */}
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={handleBookmarkPost}
            >
              {isBookmarking && <LoadingSpinner size="sm" />}
              {!isBookmarked && !isBookmarking && (
                <FaBookmark className="w-4 h-4 cursor-pointer group-hover:text-yellow-600" />
              )}
              {isBookmarked && !isBookmarking && (
                <FaBookmark className="w-4 h-4 text-yellow-600 cursor-pointer" />
              )}
              {isMyPost && (
                <span
                  className={`text-sm group-hover:text-yellow-600 ${
                    isBookmarked ? "text-yellow-600" : ""
                  }`}
                >
                  {post.bookmarks.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
