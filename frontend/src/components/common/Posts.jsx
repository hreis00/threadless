import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import PostCard from "./PostCard";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      case "bookmarks":
        return `/api/posts/bookmarks/${userId}`;
      case "people":
        return `/api/users`;
      case "mostRecent":
        return `/api/posts/all`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
    isRefetching: isRefetchingPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetchPosts();
  }, [feedType, refetchPosts, username]);

  return (
    <>
      {(isLoadingPosts || isRefetchingPosts) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoadingPosts && !isRefetchingPosts && posts?.length === 0 && (
        <p className="my-4 text-center">Nothing to be displayed yet!</p>
      )}
      {!isLoadingPosts && !isRefetchingPosts && posts && (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
