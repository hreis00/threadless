import { useQuery } from "@tanstack/react-query";

import Post from "../../../components/common/Post";

const MostRecent = ({ feedType }) => {
  const { data: mostRecent } = useQuery({
    queryKey: ["mostRecent"],
    queryFn: async () => {
      const res = await fetch("/api/posts/all");
      const data = await res.json();
      return data;
    },
  });

  return (
    <>
      {mostRecent && feedType === "mostRecent" && (
        <ul>
          {mostRecent.map((post) => (
            <li className="flex flex-col gap-3 overflow-hidden" key={post._id}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MostRecent;
