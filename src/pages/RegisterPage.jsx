import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SkinmuseLogo2 from "../assets/images/skinmuselogo2.png";
import toast from "react-hot-toast";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const response = await axios.post("http://localhost:3000/api/signup", {
      email,
      password,
      confirm_password: confirmPassword,
    });
    if ([200, 201].includes(response.status)) {
      toast.success("Registered  in successfully!");
      navigate("/signup");
    } else {
      toast.success("Registered  in Failed!");
    }
    // Add registration logic here
  };

  return (
    <div className=" bg-gradient-to-b h-full w-full from-[#fad1e3] to-[#ff65aa]/10 flex flex-col items-center justify-center font-kaisei">
      {/* Bigger logo above form */}
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
            placeholder="toffee@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl text-black bg-white focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Password:
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl text-black bg-white focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Confirm Password:
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 shadow-md text-black rounded-xl bg-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#A55166] text-white py-3 rounded-xl font-bold font-inter hover:bg-[#914257] transition"
        >
          Register
        </button>
        <p
          className="text-black font-bold text-center mt-4"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          Already have an account?{" "}
          <Link
            to="/signup"
            className="text-black font-bold no-underline hover:no-underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
