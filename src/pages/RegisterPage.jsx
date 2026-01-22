import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MakeupMuseLogo from "../assets/images/makeupmuse.jpg";
import toast from "react-hot-toast";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return "";
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (strongRegex.test(pwd)) return "Strong";
    if (mediumRegex.test(pwd)) return "Medium";
    return "Weak";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        email,
        password,
        confirm_password: confirmPassword,
      });
      if ([200, 201].includes(response.status)) {
        toast.success("Account created successfully!");
        navigate("/signup");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during registration",
      );
    }
  };

  const inputStyles =
    "w-full p-4 border border-[#F2E8E4] rounded-2xl text-black bg-[#FCFAFA] focus:outline-none focus:border-[#A55166] focus:ring-1 focus:ring-[#A55166] transition-all duration-300 placeholder:text-gray-300";
  const labelStyles =
    "block mb-2 text-[#332B2D] text-xs font-bold tracking-widest uppercase ml-1";

  // Improved Eye Icon Component
  const EyeIcon = ({ visible }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 hover:text-[#A55166] transition-colors"
    >
      {visible ? (
        <>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FAD1E3] opacity-20 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <img
            src={MakeupMuseLogo}
            alt="MakeupMuse Logo"
            className="w-48 h-auto object-contain mb-6"
          />
          <h2
            className="text-2xl text-[#332B2D] font-light text-center"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            Create Your{" "}
            <span className="italic font-bold text-[#A55166]">Artistry</span>{" "}
            Profile
          </h2>
        </div>

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
            </div>

            {/* Password Field */}
            <div>
              <label className={labelStyles}>Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`${inputStyles} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 focus:outline-none hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              <div className="text-xs mt-2 ml-1">
                <span className="text-gray-500 font-medium">Strength: </span>
                <span
                  className={
                    passwordStrength === "Strong"
                      ? "text-green-600 font-bold"
                      : passwordStrength === "Medium"
                        ? "text-yellow-500 font-bold"
                        : "text-red-600 font-bold"
                  }
                >
                  {passwordStrength || "Enter password"}
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className={labelStyles}>Confirm Password</label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`${inputStyles} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 p-1 focus:outline-none hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

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
