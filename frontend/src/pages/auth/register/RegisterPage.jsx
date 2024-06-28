import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import ThreadlessLogo from "../../../components/svgs/ThreadlessLogo";
import OAuth from "../../../components/common/OAuth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const navigate = useNavigate();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            fullName,
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
      toast.success("Account created successfully");
      navigate("/login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
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
          <h1 className="text-4xl font-extrabold text-white">Start today.</h1>
          <label className="flex items-center gap-2 rounded input input-bordered">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center flex-1 gap-2 rounded input input-bordered">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="flex items-center flex-1 gap-2 rounded input input-bordered">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
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
            {isPending ? "Loading..." : "Sign up"}
          </button>
          <OAuth />
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4 lg:w-2/3">
          <p className="text-lg text-center text-white">
            Already have an account?
          </p>
          <Link to="/login">
            <button className="w-full btn btn-base-300 btn-outline">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
