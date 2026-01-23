import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import MakeupMuseLogo from "../assets/images/makeupmuse.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null); // for resend cooldown
  const navigate = useNavigate();

  // -------------------- Step 1: Login --------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      if (response.data.mfaRequired) {
        toast.success("OTP sent to your email!");
        setMfaRequired(true);
        setOtpSentTime(Date.now());
      } else {
        // fallback if MFA not enabled
        finalizeLogin(response.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed due to server error",
      );
    }
  };

  // -------------------- Step 2: Verify OTP --------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/verify-otp",
        { email, otp },
      );

      finalizeLogin(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // -------------------- Resend OTP --------------------
  const handleResendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      toast.success("OTP resent to your email!");
      setOtpSentTime(Date.now());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  // -------------------- Finalize Login --------------------
  const finalizeLogin = (data) => {
    toast.success("Logged in successfully!");

    sessionStorage.setItem("access-token", data.accessToken);
    sessionStorage.setItem("email", data.email);
    sessionStorage.setItem("role", data.userRole);
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("profilePic", data.avatar);

    navigate("/dashboard");
  };

  const inputStyles =
    "w-full p-4 border border-[#F2E8E4] rounded-2xl text-black bg-[#FCFAFA] focus:outline-none focus:border-[#A55166] focus:ring-1 focus:ring-[#A55166] transition-all duration-300 placeholder:text-gray-300";
  const labelStyles =
    "block mb-2 text-[#332B2D] text-xs font-bold tracking-widest uppercase ml-1";

  const otpCooldown = otpSentTime
    ? Math.max(0, 30 - Math.floor((Date.now() - otpSentTime) / 1000))
    : 0;

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
                type="email"
                name="email"
                placeholder="toffee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles}
                required
                disabled={mfaRequired} // ✅ cannot change email after OTP sent
              />
            </div>

            {!mfaRequired && (
              <div>
                <label className={labelStyles}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>
            )}

            {mfaRequired && (
              <div>
                <label className={labelStyles}>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                  className="text-[#A55166] font-bold hover:underline underline-offset-4 transition-all"
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
