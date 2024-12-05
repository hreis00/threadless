import React from 'react';
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function OAuth() {
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
          credentials: 'include'
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to authenticate with Google');
        }

        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Google auth error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Successfully logged in with Google!");
      navigate("/terms-and-conditions");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login with Google");
      console.error("Mutation error:", error);
    }
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
      className="gap-2 w-full btn btn-base-300 btn-outline"
    >
      <AiFillGoogleCircle className="w-6 h-6" /> Continue with Google
    </button>
  );
}

export default OAuth;
