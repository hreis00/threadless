import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useFollow from "../../hooks/useFollow";
import FollowButton from "./FollowButton";

const Users = () => {
  const { follow, isPending } = useFollow();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: users } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return (
    <>
      <div className="">
        {users?.map((user) => (
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
                <span className="text-sm text-slate-500">@{user.username}</span>
              </div>
            </div>
            <div>
              <FollowButton
                userId={user._id}
                isFollowing={authUser?.following.includes(user._id)}
                follow={follow}
                isPending={isPending}
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Users;
