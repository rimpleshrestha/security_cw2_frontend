import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Homepage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import Quiz from "../pages/Quiz";
import CreatePostPage from "../pages/CreatePostPage";
import ProfilePage from "../pages/Profilepage";
import ProductPage from "../pages/Productpage";
import { Toaster } from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import ProductList from "../pages/ProductList";
import AboutUs from "../pages/AboutUs"; // <-- Added

const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(sessionStorage.getItem("access-token"));

  useEffect(() => {
    const newToken = sessionStorage.getItem("access-token");
    setToken(newToken);
  }, [location]);

  const logout = () => {
    sessionStorage.removeItem("access-token");
    setToken(null);
    navigate("/register");
  };

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-post/" element={<CreatePostPage />} />
          <Route path="/create-post/:id" element={<CreatePostPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/saved-products" element={<ProductList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutUs />} />{" "}
          {/* <-- New About Us route */}
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default AppRouter;
