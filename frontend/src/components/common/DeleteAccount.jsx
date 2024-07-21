import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/users/deleteAccount", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      navigate("/login");
    },
  });

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <p>Delete your account</p>

      <button
        className="btn btn-error btn-sm"
        onClick={() => document.getElementById("delete_account").showModal()}
      >
        Delete
      </button>
      <dialog id="delete_account" className="p-2 modal">
        <div className="modal-box">
          <div className="p-2 space-y-2">
            <div>
              <p className="font-bold">
                Are you sure you want to delete your account?
              </p>
              <p>
                All the associated data (posts, comments, likes, bookmarks,
                etc.) will be permanently deleted.
              </p>
              <p className="font-bold text-error">
                This action cannot be undone.
              </p>
            </div>

            {isDeleting && <LoadingSpinner />}

            {deleteAccount && !isDeleting && (
              <button
                className="btn btn-error btn-sm"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default DeleteAccount;
