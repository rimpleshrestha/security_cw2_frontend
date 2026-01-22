import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MakeupMuseLogo from "../assets/images/makeupmuse.jpg";
import toast from "react-hot-toast";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New state for inline messages
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        email,
        password,
        confirm_password: confirmPassword,
      });

      if ([200, 201].includes(response.status)) {
        setSuccessMsg("Account created successfully!");
        toast.success("Account created successfully!");
        navigate("/signup");
      } else {
        setErrors({ general: "Registration failed. Please try again." });
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "An error occurred during registration";
      setErrors({ general: msg });
      toast.error(msg);
    }
  };

  const inputStyles =
    "w-full p-4 border border-[#F2E8E4] rounded-2xl text-black bg-[#FCFAFA] focus:outline-none focus:border-[#A55166] focus:ring-1 focus:ring-[#A55166] transition-all duration-300 placeholder:text-gray-300";
  const labelStyles =
    "block mb-2 text-[#332B2D] text-xs font-bold tracking-widest uppercase ml-1";
  const errorStyles = "text-red-500 text-xs mt-1 ml-1";

  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center justify-center px-6 py-12">
      {/* Decorative Background Blur */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FAD1E3] opacity-20 blur-[100px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={MakeupMuseLogo}
            alt="MakeupMuse Logo"
            className="w-48 h-auto object-contain mb-6"
          />
          <h2
            className="text-2xl text-[#332B2D] font-light"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            Create Your{" "}
            <span className="italic font-bold text-[#A55166]">Artistry</span>{" "}
            Profile
          </h2>
        </div>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="bg-white p-10 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-[#F2E8E4]"
        >
          <div className="space-y-6">
            <div>
              <label className={labelStyles}>Email Address</label>
              <input
                type="email"
                placeholder="muse@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles}
                required
              />
              {errors.email && <p className={errorStyles}>{errors.email}</p>}
            </div>

            {/* Password field */}
            <div className="relative">
              <label className={labelStyles}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && (
                <p className={errorStyles}>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="relative">
              <label className={labelStyles}>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputStyles}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[38px] text-gray-500"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirmPassword && (
                <p className={errorStyles}>{errors.confirmPassword}</p>
              )}
            </div>

            {errors.general && <p className={errorStyles}>{errors.general}</p>}
            {successMsg && (
              <p className="text-green-600 text-xs mt-1 ml-1">{successMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#332B2D] text-white py-4 rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-[#A55166] transition-all duration-500 shadow-lg mt-4 active:scale-95"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-[#F2E8E4] text-center">
            <p
              className="text-[#7A6B6E] text-sm font-medium"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            >
              Already a member?{" "}
              <Link
                to="/signup"
                className="text-[#A55166] font-bold hover:underline underline-offset-4 transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
