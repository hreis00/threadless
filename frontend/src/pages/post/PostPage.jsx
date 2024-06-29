import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FaBookmark, FaComment, FaHeart, FaTrash } from "react-icons/fa";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import { formatDate } from "../../utils/date";

import toast from "react-hot-toast";

const PostPage = () => {
  const { postId } = useParams();

  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: post,
    isLoading: isLoadingPost,
    isRefetching: isRefetchingPost,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/post/${postId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/comments/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: comment,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["post"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      try {
        const res = await fetch(`/api/comments/${post._id}/${commentId}`, {
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
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formattedPostDate = formatDate(post?.createdAt);
  const isMyPost = authUser._id === post?.user?._id;
  const isLiked = post?.likes?.includes(authUser._id);
  const isBookmarked = post?.bookmarks?.includes(authUser._id);

  const handleBookmarkPost = () => {
    if (isBookmarking) return;
    bookmarkPost();
  };

  const handleDeletePost = () => {
    deletePost();
    navigate("/");
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {isLoadingPost ||
          (isRefetchingPost && (
            <div className="flex flex-col justify-center">
              <PostSkeleton />
            </div>
          ))}
        {!isLoadingPost && !isRefetchingPost && post && (
          <div className="flex items-start gap-2 p-4 border-b border-gray-700">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <Link to={`/profile/${post?.user?.username}`} className="">
                  <img
                    src={post?.user?.profileImage || "/avatar-placeholder.png"}
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${post?.user?.username}`}
                  className="font-bold"
                >
                  {post?.user?.fullName}
                </Link>
                <span className="flex gap-1 text-xs font-thin">
                  <Link to={`/profile/${post?.user?.username}`}>
                    @{post?.user?.username}
                  </Link>
                  <span>·</span>
                  <span>{formattedPostDate}</span>
                </span>
                {isMyPost && (
                  <span className="flex justify-end flex-1">
                    {!isDeletingPost && (
                      <FaTrash
                        className="cursor-pointer hover:text-red-500"
                        onClick={handleDeletePost}
                      />
                    )}

                    {isDeletingPost && <LoadingSpinner size="sm" />}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <span className="py-2 text-lg font-bold">{post.name}</span>
                {post.description && <span>{post.description}</span>}
                <div className="w-fit">
                  <button
                    onClick={() =>
                      document.getElementById("image-selected").showModal()
                    }
                  >
                    <img
                      src={post.image}
                      className="object-contain border border-gray-700 rounded-lg cursor-pointer h-80"
                      alt=""
                    />
                  </button>
                  <dialog id="image-selected" className="p-4 modal">
                    <div className="w-fit p-0 modal-box max-w-[1200px]">
                      <form method="dialog">
                        <button className="absolute top-1 right-1 btn btn-sm btn-circle hover:btn-error">
                          ✕
                        </button>
                      </form>
                      <img src={post.image} alt="" className="rounded " />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button className="outline-none">Close</button>
                    </form>
                  </dialog>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center justify-around w-full gap-4">
                  {/* Comment */}
                  <div className="flex items-center gap-1 group">
                    <FaComment className="w-4 h-4 group-hover:text-sky-400" />
                    <span className="text-sm group-hover:text-sky-400">
                      {post?.comments?.length}
                    </span>
                  </div>
                  {/* Like */}
                  <div
                    className="flex items-center gap-1 cursor-pointer group"
                    onClick={handleLikePost}
                  >
                    {isLiking && <LoadingSpinner size="sm" />}
                    {!isLiked && !isLiking && (
                      <FaHeart className="w-4 h-4 cursor-pointer group-hover:text-pink-500" />
                    )}
                    {isLiked && !isLiking && (
                      <FaHeart className="w-4 h-4 text-pink-500 cursor-pointer " />
                    )}
                    <span
                      className={`text-sm group-hover:text-pink-500 ${
                        isLiked ? "text-pink-500" : ""
                      }`}
                    >
                      {post?.likes?.length}
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
        )}

        {/* Comment section */}
        {!isLoadingPost && !isRefetchingPost && (
          <div className="flex flex-col items-start gap-2 p-4 border-b border-gray-700">
            <form
              className="flex items-center w-full gap-2 mt-4"
              onSubmit={handlePostComment}
            >
              <textarea
                className="w-full p-2 border border-gray-700 rounded resize-none textarea text-md focus:outline-none"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="px-4 rounded-full btn btn-primary btn-sm"
                disabled={!comment.trim()}
              >
                {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
              </button>
            </form>
            {post?.comments?.length === 0 && (
              <p className="w-full text-center text-gray-500">
                Be the first one to comment!
              </p>
            )}
            {post?.comments.length > 0 && (
              <>
                {post.comments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((comment) => (
                    <div
                      key={comment._id}
                      className="flex items-start w-full gap-2 p-2 border border-gray-700 rounded bg-base-300"
                    >
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImage ||
                              "/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/profile/${comment.user.username}`}
                            className="font-bold"
                          >
                            {comment.user.fullName}
                          </Link>
                          <span className="flex gap-1 text-xs font-thin">
                            <Link to={`/profile/${comment.user.username}`}>
                              @{comment.user.username}
                            </Link>
                            <span>·</span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </span>
                          {authUser && authUser._id === comment.user._id && (
                            <span className="flex justify-end flex-1">
                              {!isDeletingComment && (
                                <FaTrash
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                />
                              )}

                              {isDeletingComment && (
                                <LoadingSpinner size="sm" />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="py-1 text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PostPage;
