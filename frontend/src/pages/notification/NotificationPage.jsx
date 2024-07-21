import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaBookmark, FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex-[1_1_0] mr-auto border-r border-gray-700 min-h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1">
            <IoSettingsOutline className="w-4" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={deleteNotifications}>Delete all notifications</a>
            </li>
          </ul>
        </div>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {notifications?.length === 0 && (
        <div className="p-4 font-bold text-center">No notifications 🤔</div>
      )}
      {notifications?.map((notification) => (
        <div className="border-b border-gray-700" key={notification._id}>
          <div className="flex gap-2 p-4">
            {notification.type === "follow" && (
              <FaUser className="w-5 h-5 text-sky-400" />
            )}
            {notification.type === "like" && (
              <FaHeart className="w-5 h-5 text-red-500" />
            )}
            {notification.type === "comment" && (
              <FaComment className="w-5 h-5 text-sky-400" />
            )}
            {notification.type === "bookmark" && (
              <FaBookmark className="w-5 h-5 text-yellow-600" />
            )}
            <div className="avatar">
              <div className="w-8 rounded-full">
                <Link to={`/profile/${notification.from.username}`}>
                  <img
                    src={
                      notification.from.profileImage ||
                      "/avatar-placeholder.png"
                    }
                  />
                </Link>
              </div>
            </div>
            <div className="flex gap-1">
              <Link to={`/profile/${notification.from.username}`}>
                <span className="font-bold">@{notification.from.username}</span>
              </Link>
              <>
                {notification.type === "follow" && <span>followed you!</span>}
                {notification.type === "like" && <span>liked your post!</span>}
                {notification.type === "comment" && (
                  <span>commented on your post!</span>
                )}
                {notification.type === "bookmark" && (
                  <span>bookmarked your post!</span>
                )}
              </>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default NotificationPage;
