import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import LoginPage from "./pages/auth/login/LoginPage";
import SearchPage from "./pages/search/SearchPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
// import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ExhibitionPage from "./pages/exhibition/ExhibitionPage";
import ExhibitionsPage from "./pages/exhibition/ExhibitionsPage";
import PostPage from "./pages/post/PostPage";
import TermsAndConditions from "./pages/terms and conditions/TermsAndConditions";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex mx-auto max-w-7xl">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/search"
          element={authUser ? <SearchPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/exhibitions"
          element={authUser ? <ExhibitionsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/exhibition/:slug"
          element={authUser ? <ExhibitionPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/terms-and-conditions"
          element={authUser ? <TermsAndConditions /> : <Navigate to="/login" />}
        />
      </Routes>
      {/* {authUser && <RightPanel />} */}
      <Toaster />
    </div>
  );
}

export default App;
