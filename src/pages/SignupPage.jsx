import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SkinmuseLogo2 from "../assets/images/skinmuselogo2.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      if ([200, 201].includes(response.status)) {
        toast.success("Logged in successfully!");

        sessionStorage.setItem("access-token", response.data.accessToken);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("role", response.data.userRole);
        sessionStorage.setItem("name", response.data.name);
        sessionStorage.setItem("profilePic", response.data.avatar);
        navigate("/dashboard");
      } else {
        toast.error("Login Failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed due to server error"
      );
    }
  };

  return (
    <div className="bg-gradient-to-b h-full from-[#fad1e3] to-[#ff65aa]/10 flex flex-col items-center justify-center font-kaisei">
      <img
        src={SkinmuseLogo2}
        alt="Skinmuse Logo"
        className="mb-8 w-72 h-auto"
      />

      <form
        onSubmit={onSubmit}
        className="min-w-[600px] max-md:min-w-[80%] p-8 rounded-2xl shadow-lg bg-opacity-25 backdrop-blur-md border bg-[#A55166]"
      >
        <div className="mb-4">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Email:
          </label>
          <input
            type="email"
            name="email"
            placeholder="toffee@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl text-black bg-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl bg-white text-black focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#A55166] text-white py-3 rounded-xl font-bold font-inter hover:bg-[#914257] transition"
        >
          Log In
        </button>

        <p
          className="text-black font-bold mt-4 text-center w-full"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-black font-bold no-underline hover:no-underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
