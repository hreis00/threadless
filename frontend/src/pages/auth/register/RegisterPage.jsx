import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import ThreadlessLogo from "../../../components/svgs/ThreadlessLogo";
import OAuth from "../../../components/common/OAuth";

const Register = () => {
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
    <div className="flex min-h-[100dvh] items-center mx-auto justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <ThreadlessLogo className="w-[50%] mx-auto fill-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-foreground">
            Sign up to Threadless
          </h2>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Or{" "}
            <Link
              className="font-medium text-primary hover:text-primary/90"
              to="/login"
            >
              login into your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2 rounded-md shadow-sm">
            <div>
              <label
                className="text-sm font-medium leading-none sr-only peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="relative block w-full h-10 px-3 py-2 text-sm border border-b border-gray-300 rounded-md appearance-none bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-t-md text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                id="email"
                autoComplete="email"
                required=""
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
            <div>
              <label
                className="text-sm font-medium leading-none sr-only peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="relative block w-full h-10 px-3 py-2 text-sm border border-b border-gray-300 rounded-md appearance-none bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-t-md text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                id="username"
                autoComplete="username"
                required=""
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </div>
            <div>
              <label
                className="text-sm font-medium leading-none sr-only peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="fullName"
              >
                FullName
              </label>
              <input
                className="relative block w-full h-10 px-3 py-2 text-sm border border-b border-gray-300 rounded-md appearance-none bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-t-md text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                id="fullName"
                autoComplete="fullName"
                required=""
                type="text"
                name="fullName"
                placeholder="Full Name"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </div>
            <div>
              <label
                className="text-sm font-medium leading-none sr-only peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="relative block w-full h-10 px-3 py-2 text-sm border border-b border-gray-300 rounded-md appearance-none bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-b-md text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                id="password"
                autoComplete="current-password"
                required=""
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </div>
          </div>
          <div>
            <button className="relative flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors border border-transparent rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group btn text-base-300 btn-outline bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              {isPending ? "Loading..." : "Sign up"}
            </button>
          </div>
        </form>
        <div>
          <OAuth />
          {isError && (
            <p className="p-2 text-center text-error">{error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
