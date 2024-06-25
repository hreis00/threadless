import { FaTrash } from "react-icons/fa";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
// import { formatPostDate } from "../../utils/date";
import { Link } from "react-router-dom";

const Exhibition = ({ exhibition }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // const formattedDate = formatPostDate(exhibition.createdAt);

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

  const handleDeleteExhibition = () => {
    deleteExhibition();
  };

  return (
    <>
      <div className="flex items-start gap-2 p-4 border-b border-gray-700">
        <div className="flex flex-col flex-1">
          <div className="flex items-start gap-2 p-4 border-gray-700">
            <Link to={`/exhibition/${exhibition.slug}`}>
              <div className="flex items-center gap-2">
                <span className="font-bold">{exhibition.name}</span>
                <span className="flex gap-1 text-sm text-gray-700">
                  <span>·</span>
                  {/* <span>{formattedDate}</span> */}
                </span>
              </div>
              <span className="text-sm">{exhibition.description}</span>
              <div className="py-2">
                {exhibition.image && (
                  <img
                    src={exhibition.image}
                    className="object-contain mx-auto border border-gray-700 rounded-lg h-80"
                    alt={exhibition.name}
                  />
                )}
              </div>
            </Link>
            <div className="self-stretch flex-1 p-1">
              {authUser && authUser.isAdmin && (
                <span className="flex justify-end flex-1">
                  {!isDeleting && (
                    <FaTrash
                      className="cursor-pointer hover:text-red-500"
                      onClick={handleDeleteExhibition}
                    />
                  )}

                  {isDeleting && <LoadingSpinner size="sm" />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Exhibition;
