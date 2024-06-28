import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const OAuth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (provider) => {
      try {
        const resultsFromGoogle = await signInWithPopup(auth, provider);
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL,
          }),
        });
        const data = await res.json();
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      navigate("/terms-and-conditions");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleGoogleClick = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    mutate(provider);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={isPending}
      className="gap-2 btn btn-base-300 btn-outline"
    >
      <AiFillGoogleCircle className="w-6 h-6" />
      {isPending ? "Loading..." : "Continue with Google"}
    </button>
  );
};

export default OAuth;
