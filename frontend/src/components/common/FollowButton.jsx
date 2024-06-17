import LoadingSpinner from "./LoadingSpinner";

const FollowButton = ({ userId, isFollowing, follow, isPending }) => {
  return (
    <button
      className="text-black bg-white rounded-full btn hover:bg-white hover:opacity-90 btn-sm"
      onClick={(e) => {
        e.preventDefault();
        follow(userId);
      }}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingSpinner size="sm" />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowButton;
