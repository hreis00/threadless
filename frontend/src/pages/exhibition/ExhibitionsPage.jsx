import CreateExhibition from "../../components/common/CreateExhibition";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import ExhibitionCard from "../../components/common/ExhibitionCard";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const ExhibitionsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [feedType, setFeedType] = useState("mostRecent");

  const getExhibitionsEndpoint = () => {
    switch (feedType) {
      case "mostRecent":
        return "/api/exhibitions/all";
      case "enrolled":
        return "/api/users/enrolled-exhibitions";
      default:
        return "/api/exhibitions/all";
    }
  };

  const EXHIBITION_ENDPOINT = getExhibitionsEndpoint();

  const {
    data: exhibitions,
    isLoading: isLoadingExhibitions,
    refetch: refetchExhibitions,
    isRefetching: isRefetchingExhibitions,
  } = useQuery({
    queryKey: ["exhibitions"],
    queryFn: async () => {
      try {
        const res = await fetch(EXHIBITION_ENDPOINT);
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
  }, [refetchExhibitions, feedType]);

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      {authUser && !authUser.isAdmin && (
        <div className="flex w-full border-b border-gray-700">
          <div
            className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-base-300"
            onClick={() => setFeedType("mostRecent")}
          >
            Most Recent
            {feedType === "mostRecent" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-base-300"
            onClick={() => setFeedType("enrolled")}
          >
            Enrolled
            {feedType === "enrolled" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      )}

      {/*  CREATE EXHIBITION INPUT FOR ADMINS */}
      {authUser && authUser.isAdmin && <CreateExhibition />}

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
          exhibitions.length === 0 &&
          feedType === "mostRecent" && (
            <p className="w-full text-center">No exhibitions yet.</p>
          )}

        {!isLoadingExhibitions &&
          !isRefetchingExhibitions &&
          exhibitions.length === 0 &&
          feedType === "enrolled" && (
            <p className="w-full p-4 text-center">
              No enrolled exhibitions yet.
            </p>
          )}

        {!isLoadingExhibitions && !isRefetchingExhibitions && exhibitions && (
          <div>
            {exhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default ExhibitionsPage;
