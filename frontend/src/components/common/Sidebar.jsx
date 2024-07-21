import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  MdHomeFilled,
  MdOutlineSearch,
  MdNotifications,
  MdAccountCircle,
  MdOutlineLogout,
  MdMuseum,
  MdOutlineContentCopy,
  MdOutlineSettings,
} from "react-icons/md";

import toast from "react-hot-toast";

import Threadless from "../svgs/ThreadlessLogo";
import ThreadlessIcon from "../svgs/ThreadlessLogoIcon";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-60">
      <div className="sticky top-0 left-0 flex flex-col w-20 h-screen border-r border-gray-700 md:w-full">
        <Link to="/" className="mx-auto w-fit">
          <Threadless className="hidden md:inline-block md:h-28 md:w-28 fill-primary" />
          <ThreadlessIcon className="w-20 h-20 md:hidden fill-primary" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pl-2 md:pr-4 hover:bg-base-300 max-w-fit"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="hidden text-lg md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/search"
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pr-4 md:pl-2 hover:bg-base-300 max-w-fit"
            >
              <MdOutlineSearch className="w-8 h-8" />
              <span className="hidden text-lg md:block">Search</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/exhibitions"
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pr-4 md:pl-2 hover:bg-base-300 max-w-fit"
            >
              <MdMuseum className="w-8 h-8" />
              <span className="hidden text-lg md:block">Exhibitions</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pr-4 md:pl-2 hover:bg-base-300 max-w-fit"
            >
              <MdNotifications className="w-8 h-8" />
              <span className="hidden text-lg md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pr-4 md:pl-2 hover:bg-base-300 max-w-fit"
            >
              <MdAccountCircle className="w-8 h-8" />
              <span className="hidden text-lg md:block">Profile</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/terms-and-conditions`}
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pr-4 md:pl-2 hover:bg-base-300 max-w-fit"
            >
              <MdOutlineContentCopy className="w-8 h-8" />
              <span className="hidden text-lg md:block">
                Terms & Conditions
              </span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/settings`}
              className="flex items-center gap-3 py-2 transition-all duration-300 rounded-full cursor-pointer md:pr-4 md:pl-2 hover:bg-base-300 max-w-fit"
            >
              <MdOutlineSettings className="w-8 h-8" />
              <span className="hidden text-lg md:block">Settings</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="flex items-start gap-2 px-4 py-2 mt-auto mb-10 transition-all duration-300 rounded-full hover:bg-base-300"
          >
            <div className="self-center hidden avatar md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={authUser?.profileImage || "/avatar-placeholder.png"}
                />
              </div>
            </div>
            <div className="flex justify-center flex-1 md:justify-between">
              <div className="hidden md:block">
                <p className="w-20 text-sm font-bold truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-xs">@{authUser?.username}</p>
              </div>
              <MdOutlineLogout
                className="self-center w-5 h-5 cursor-pointer"
                title="Logout"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
        <div className="p-4 text-xs">
          <p>Copyright © 2024</p>
          <p className="hidden md:inline-block">
            Hugo Bettencourt dos Santos de Sá Reis - Nº. 35130
          </p>
          <p className="hidden md:inline-block">PA - 2023/24</p>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
