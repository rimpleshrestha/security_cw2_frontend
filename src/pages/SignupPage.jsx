import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import MakeupMuseLogo from "../assets/images/makeupmuse.jpg";
import toast from "react-hot-toast";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const inputStyles =
    "w-full p-4 border border-[#F2E8E4] rounded-2xl text-black bg-[#FCFAFA] focus:outline-none focus:border-[#A55166] focus:ring-1 focus:ring-[#A55166] transition-all duration-300 placeholder:text-gray-300";
  const labelStyles =
    "block mb-2 text-[#332B2D] text-xs font-bold tracking-widest uppercase ml-1";

  const otpCooldown = otpSentTime
    ? Math.max(0, 30 - Math.floor((Date.now() - otpSentTime) / 1000))
    : 0;

  // STRICT SANITIZATION: Prevents XSS by blocking brackets and cleaning the string
  const sanitize = (value) => {
    if (typeof value !== "string") return "";
    // 1. Remove < and > immediately to block tag formation
    const noBrackets = value.replace(/[<>]/g, "");
    // 2. DOMPurify with strict no-tags policy
    return DOMPurify.sanitize(noBrackets, { ALLOW_TAGS: [] });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: sanitize(email),
      password: password, // Send raw for verification, sanitized in input handler anyway
      captchaValue: captchaValue, // Already sanitized via onChange
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/api/login`, payload);
      setCaptchaValue(null);

      if (response.data.mfaRequired) {
        toast.success("OTP sent to your email!");
        setMfaRequired(true);
        setOtpSentTime(Date.now());
      } else {
        finalizeLogin(response.data);
      }
    } catch (error) {
      setCaptchaValue(null);
      toast.error(
        error.response?.data?.message || "Login failed due to server error",
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/verify-otp`, {
        email: sanitize(email),
        otp: sanitize(otp),
      });
      finalizeLogin(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    const payload = { email: sanitize(email), password: password };

    try {
      await axios.post(`${BACKEND_URL}/api/login`, payload);
      toast.success("OTP resent to your email!");
      setOtpSentTime(Date.now());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const finalizeLogin = (data) => {
    toast.success("Logged in successfully!");
    sessionStorage.setItem("access-token", data.accessToken);
    sessionStorage.setItem("email", data.email);
    sessionStorage.setItem("role", data.userRole);
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("profilePic", data.avatar);
    navigate("/dashboard");
  };

  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FAD1E3] opacity-20 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
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
            Welcome Back,{" "}
            <span className="italic font-bold text-[#A55166]">Muse</span>
          </h2>
        </div>

        <form
          onSubmit={mfaRequired ? handleVerifyOtp : handleLogin}
          className="bg-white p-10 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-[#F2E8E4]"
        >
          <div className="space-y-6">
            <div>
              <label className={labelStyles}>Email Address</label>
              <input
                type="text"
                placeholder="muse@example.com"
                value={email}
                onChange={(e) => setEmail(sanitize(e.target.value))}
                className={inputStyles}
                required
                disabled={mfaRequired}
              />
            </div>

            {!mfaRequired && (
              <div className="relative">
                <label className={labelStyles}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(sanitize(e.target.value))}
                  className={inputStyles}
                  required
                />
                <span
                  className="absolute right-4 top-10 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </span>
              </div>
            )}

            {!mfaRequired && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6LcT3lMsAAAAAO40bwsQCSrT6yHorzzFzLo9B8az"
                  onChange={(value) => setCaptchaValue(sanitize(value))}
                />
              </div>
            )}

            {mfaRequired && (
              <div>
                <label className={labelStyles}>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(sanitize(e.target.value))}
                  className={inputStyles}
                  required
                />
                <button
                  type="button"
                  disabled={otpCooldown > 0}
                  onClick={handleResendOtp}
                  className="mt-2 text-xs text-[#A55166] font-bold hover:underline"
                >
                  {otpCooldown > 0
                    ? `Resend OTP in ${otpCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#332B2D] text-white py-4 rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-[#A55166] transition-all duration-500 shadow-lg mt-4 active:scale-95"
            >
              {mfaRequired ? "Verify OTP" : "Log In"}
            </button>
          </div>

          {!mfaRequired && (
            <div className="mt-8 pt-8 border-t border-[#F2E8E4] text-center">
              <p
                className="text-[#7A6B6E] text-sm font-medium"
                style={{ fontFamily: "'Julius Sans One', sans-serif" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#A55166] font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
