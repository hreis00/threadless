import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [coverImage, setcoverImage] = useState(null);
  const [profileImage, setprofileImage] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImageRef = useRef(null);
  const profileImageRef = useRef(null);

  const { username } = useParams();

  const { follow, isPending } = useFollow();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { data: userPosts } = useQuery({
    queryKey: ["userPosts"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const isMyProfile = authUser._id === user?._id;

  const memberSinceDate = formatMemberSinceDate(user?.createdAt);

  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImage" && setcoverImage(reader.result);
        state === "profileImage" && setprofileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="mt-4 text-lg text-center">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex items-center gap-10 px-4 py-2">
                <button onClick={() => navigate(-1)}>
                  <FaArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-col">
                  <p className="text-lg font-bold">{user?.fullName}</p>
                  <span className="text-sm">
                    {0 || userPosts?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImage || user?.coverImage || "/cover.png"}
                  className="object-cover w-full h-52"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute p-2 transition duration-200 bg-gray-800 bg-opacity-75 rounded-full opacity-0 cursor-pointer top-2 right-2 group-hover/cover:opacity-100"
                    onClick={() => coverImageRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={coverImageRef}
                  onChange={(e) => handleImgChange(e, "coverImage")}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={profileImageRef}
                  onChange={(e) => handleImgChange(e, "profileImage")}
                />
                {/* USER AVATAR */}
                <div className="absolute avatar -bottom-16 left-4">
                  <div className="relative w-32 rounded-full group/avatar">
                    <img
                      src={
                        profileImage ||
                        user?.profileImage ||
                        "/avatar-placeholder.png"
                      }
                    />
                    {isMyProfile && (
                      <div className="absolute p-1 rounded-full opacity-0 cursor-pointer top-5 right-3 bg-primary group-hover/avatar:opacity-100">
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImageRef.current.click()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="rounded-full btn btn-outline btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Unfollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {(coverImage || profileImage) && (
                  <button
                    className="px-4 ml-2 text-white rounded-full btn btn-primary btn-sm"
                    onClick={async () => {
                      await updateProfile({ coverImage, profileImage });
                      setcoverImage(null);
                      setprofileImage(null);
                    }}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 px-4 mt-14">
                <div className="flex flex-col">
                  <span className="text-lg font-bold">{user?.fullName}</span>
                  <span className="text-xs">@{user?.username}</span>
                  <span className="my-1 text-sm">{user?.bio}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="w-4 h-4" />
                    <span className="text-sm">{memberSinceDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">
                      {user?.following.length}
                    </span>
                    <span className="text-xs">Following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">
                      {user?.followers.length}
                    </span>
                    <span className="text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full mt-4 border-b border-gray-700">
                <div
                  className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-base-300"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-base-300"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                {isMyProfile && (
                  <div
                    className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-base-300"
                    onClick={() => setFeedType("bookmarks")}
                  >
                    Bookmarks
                    {feedType === "bookmarks" && (
                      <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
