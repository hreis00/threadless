import Exhibitions from "../../components/common/Exhibitions";
import CreateExhibition from "../../components/common/CreateExhibition";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ExhibitionsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [feedType, setFeedType] = useState("mostRecent");

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      {authUser && !authUser.isAdmin && (
        <div className="flex w-full border-b border-gray-700">
          <div
            className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-secondary"
            onClick={() => setFeedType("mostRecent")}
          >
            Most Recent
            {feedType === "mostRecent" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-secondary"
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

      {/*  EXHIBITIONS */}
      <Exhibitions />
    </div>
  );
};

export default ExhibitionsPage;
