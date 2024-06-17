import { useState } from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { MdOutlineSearch } from "react-icons/md";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FollowButton from "../../components/common/FollowButton";

import Post from "../../components/common/Post";

import useFollow from "../../hooks/useFollow";

const SearchPage = () => {
  const [feedType, setFeedType] = useState("people");
  const [searchQuery, setSearchQuery] = useState("");

  const { follow, isPending } = useFollow();

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: searchUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/search/${searchQuery}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!searchQuery,
  });

  const {
    data: searchPosts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useQuery({
    queryKey: ["searchPosts", searchQuery],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/search/${searchQuery}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!searchQuery,
  });

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      <div className="py-2">
        <label className="flex items-center mx-auto bg-stone-900 input rounded max-w-[50%] input-bordered">
          <MdOutlineSearch size={20} />
          <input
            className="text-center grow"
            placeholder="Search on Threadless"
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </label>
      </div>
      <div className="flex w-full border-b border-gray-700">
        <div
          className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-secondary"
          onClick={() => setFeedType("people")}
        >
          People
          {feedType === "people" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
          )}
        </div>

        <div
          className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-secondary"
          onClick={() => setFeedType("mostRecent")}
        >
          Most Recent
          {feedType === "mostRecent" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
          )}
        </div>
      </div>
      {isLoadingUsers ||
        (isLoadingPosts && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ))}
      {isErrorUsers ||
        (isErrorPosts && (
          <div className="text-center text-red-500">
            Error loading search results
          </div>
        ))}

      {/* People */}
      {searchUsers?.length === 0 && feedType === "people" && (
        <div className="text-center text-gray-500">No search results found</div>
      )}

      {searchUsers &&
        feedType === "people" &&
        searchUsers?.map((user) => (
          <>
            <Link
              key={user._id}
              to={`/profile/${user.username}`}
              className="flex items-center justify-between px-4 py-2 hover:bg-secondary"
            >
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={user.profileImage || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{user.username}
                  </span>
                </div>
              </div>

              <FollowButton
                userId={user._id}
                isFollowing={authUser?.following.includes(user._id)}
                follow={follow}
                isPending={isPending}
              />
            </Link>
          </>
        ))}

      {/* Most Recent */}
      {searchPosts?.length === 0 && feedType === "mostRecent" && (
        <div className="text-center text-gray-500">No search results found</div>
      )}
      {searchPosts &&
        feedType === "mostRecent" &&
        searchPosts?.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default SearchPage;
