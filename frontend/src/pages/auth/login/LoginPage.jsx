import { useState } from "react";
import { Link } from "react-router-dom";

import { MdPassword, MdPerson } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import ThreadlessLogo from "../../../components/svgs/ThreadlessLogo";
import OAuth from "../../../components/common/OAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: LoginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Login successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen max-w-screen-xl px-10 mx-auto">
      <div className="items-center justify-center flex-1 hidden lg:flex">
        <ThreadlessLogo className="w-80 fill-primary" />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <form
          className="flex flex-col gap-4 mx-auto lg:w-2/3 md:mx-20"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white">
            {"Let's"} start.
          </h1>
          <label className="flex items-center gap-2 rounded input input-bordered">
            <MdPerson />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="flex items-center gap-2 rounded input input-bordered">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn btn-base-300">
            {isPending ? "Loading..." : "Login"}
          </button>
          <OAuth />
          {isError && <p className="text-error">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-lg text-white">{"Don't"} have an account?</p>
          <Link to="/register">
            <button className="w-full btn btn-base-300 btn-outline">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
