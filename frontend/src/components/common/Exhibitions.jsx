import { useQuery } from "@tanstack/react-query";
import Exhibition from "./Exhibition";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect } from "react";

const Exhibitions = () => {
  const {
    data: exhibitions,
    isLoading: isLoadingExhibitions,
    refetch: refetchExhibitions,
    isRefetching: isRefetchingExhibitions,
  } = useQuery({
    queryKey: ["exhibitions"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/exhibitions/all`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  useEffect(() => {
    refetchExhibitions();
  }, [refetchExhibitions]);

  return (
    <>
      {(isLoadingExhibitions || isRefetchingExhibitions) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoadingExhibitions &&
        !isRefetchingExhibitions &&
        exhibitions.length === 0 && (
          <p className="w-full text-center">No exhibitions yet.</p>
        )}
      {!isLoadingExhibitions && !isRefetchingExhibitions && exhibitions && (
        <div>
          {exhibitions.map((exhibition) => (
            <Exhibition key={exhibition._id} exhibition={exhibition} />
          ))}
        </div>
      )}
    </>
  );
};

export default Exhibitions;
