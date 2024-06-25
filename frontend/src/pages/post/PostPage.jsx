import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PostCard from "../../components/common/PostCard";

const PostPage = () => {
  const { postId } = useParams();

  const { data: post } = useQuery({
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

  return <div className="w-full">{post && <PostCard post={post} />}</div>;
};

export default PostPage;
