import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { axiosInstance } from "../../api/axiosinstance";
import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast, or use your preferred library

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if both params exist
    if (!token || !email) {
      toast.error("Email and token required");
      navigate("/signup");
    } else {
      setIsLoading(false);
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/reset-password", {
        email,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage("Password reset successful! You can now log in.");
      toast.success("Password updated successfully!");
    } catch (err) {
      console.log(err);
      const errorMsg =
        err.response?.data?.message || "Error resetting password.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (isLoading) return null; // Prevent UI flash during redirect

  return (
    <div className="min-h-screen bg-[#FCFAFA] flex flex-col items-center justify-center px-6 py-20 font-inter relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FAD1E3]/30 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white border border-[#F2E8E4] rounded-[40px] p-10 md:p-12 shadow-[0_20px_40px_rgba(165,81,102,0.03)] relative z-10 text-center"
      >
        <h2
          className="text-3xl md:text-4xl font-light text-[#3D3436] mb-4"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          Define Your{" "}
          <span className="text-[#A55166] italic font-bold">New Look</span>
        </h2>

        <p className="text-[#7A6B6E] font-light mb-8 leading-relaxed">
          Secure your account for{" "}
          <span className="font-medium text-[#3D3436]">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#A55166] font-bold ml-1 mb-2 block">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-4 bg-[#FCFAFA] border border-[#F2E8E4] rounded-2xl focus:border-[#A55166]/50 focus:outline-none transition-all text-[#3D3436] placeholder:text-[#b0ada3]"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#A55166] font-bold ml-1 mb-2 block">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-4 bg-[#FCFAFA] border border-[#F2E8E4] rounded-2xl focus:border-[#A55166]/50 focus:outline-none transition-all text-[#3D3436] placeholder:text-[#b0ada3]"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#3D3436] text-white py-5 mt-4 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#A55166] transition-all shadow-lg"
          >
            Reset Password
          </motion.button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-8 p-4 rounded-2xl text-sm font-medium ${
              message.includes("successful")
                ? "bg-[#FAD1E3]/20 text-[#A55166]"
                : "bg-red-50 text-red-400"
            }`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
