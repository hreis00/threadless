import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatDate } from "../../utils/date";
import { Link } from "react-router-dom";

const Exhibition = ({ exhibition }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const formattedExhibitionDate = formatDate(exhibition.createdAt);

  const queryClient = useQueryClient();

  const { mutate: deleteExhibition, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/exhibitions/${exhibition._id}`, {
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
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["exhibitions"] });
    },
  });

  const { mutate: enrollExhibition, isPending: isEnrolling } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/enroll/${exhibition._id}`, {
          method: "POST",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Exhibition enrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["exhibitions"] });
    },
  });

  const { mutate: unenrollExhibition, isPending: isUnenrolling } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/unenroll/${exhibition._id}`, {
          method: "POST",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Exhibition enrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["exhibitions"] });
    },
  });

  const handleDeleteExhibition = () => {
    deleteExhibition();
  };

  const handleEnrollExhibition = () => {
    enrollExhibition();
  };

  const handleUnenrollExhibition = () => {
    unenrollExhibition();
  };

  return (
    <>
      <div className="flex items-start gap-2 p-4 border-b border-gray-700">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col items-start gap-2 border-gray-700">
            <div className="flex flex-col w-full gap-2 ">
              <span className="flex items-center gap-2">
                {(authUser && authUser.isAdmin) ||
                exhibition.enrolledUsers.includes(authUser._id) ? (
                  <Link
                    to={`/exhibition/${exhibition.slug}`}
                    className="flex items-center gap-2"
                  >
                    <span className="font-bold w-fit">{exhibition.name}</span>
                    <span className="flex gap-1 text-xs w-fit">
                      <span>·</span>
                      <span>{formattedExhibitionDate}</span>
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="font-bold w-fit">{exhibition.name}</span>
                    <span className="flex gap-1 text-xs w-fit">
                      <span>·</span>
                      <span>{formattedExhibitionDate}</span>
                    </span>
                  </span>
                )}

                {/* Delete exhibition - ADMIN */}
                {authUser && authUser.isAdmin && (
                  <div className="self-stretch flex-1 p-1">
                    <span className="flex justify-end flex-1">
                      {!isDeleting && (
                        <FaTrash
                          title="Delete exhibition"
                          className="cursor-pointer hover:text-red-500"
                          onClick={handleDeleteExhibition}
                        />
                      )}

                      {isDeleting && <LoadingSpinner size="sm" />}
                    </span>
                  </div>
                )}

                {/* Enroll / Uneroll exhibition */}
                {authUser && !authUser.isAdmin && (
                  <div className="self-center flex-1 p-1">
                    <span className="flex justify-end flex-1">
                      {isEnrolling || isUnenrolling ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          {exhibition.enrolledUsers.includes(authUser._id) ? (
                            <FaMinus
                              title="Unenroll exhibition"
                              className="cursor-pointer text-error"
                              onClick={handleUnenrollExhibition}
                            />
                          ) : (
                            <FaPlus
                              title="Enroll exhibition"
                              className="cursor-pointer text-info"
                              onClick={handleEnrollExhibition}
                            />
                          )}
                        </>
                      )}

                      {isDeleting && <LoadingSpinner size="sm" />}
                    </span>
                  </div>
                )}
              </span>
            </div>
          </div>

          {/* Link to exhibition page if admin or enrolled */}
          {/* {(authUser && authUser.isAdmin) ||
          exhibition.enrolledUsers.includes(authUser._id) ? (
            <Link to={`/exhibition/${exhibition.slug}`}>
              <div className="py-2 space-y-4">
                <span className="text-sm">{exhibition.description}</span>
                {exhibition.image && (
                  <img
                    src={exhibition.image}
                    className="object-contain mx-auto border border-gray-700 rounded-lg h-80"
                    alt={exhibition.name}
                  />
                )}
              </div>
            </Link>
          ) : (
            <div className="py-2 space-y-4">
              <span className="text-sm">{exhibition.description}</span>
              {exhibition.image && (
                <img
                  src={exhibition.image}
                  className="object-contain mx-auto border border-gray-700 rounded-lg h-80"
                  alt={exhibition.name}
                />
              )}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};
export default Exhibition;
