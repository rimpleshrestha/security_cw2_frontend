import { useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../../api/axiosinstance";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/request-password-reset", { email });
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAFA] flex flex-col items-center justify-center px-6 py-20 font-inter relative overflow-hidden">
      {/* Decorative Background Element to match AboutUs */}
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
          Recover Your{" "}
          <span className="text-[#A55166] italic font-bold">Muse</span>
        </h2>

        <p className="text-[#7A6B6E] font-light mb-8 leading-relaxed">
          Forgot your details? Enter your email and we will help you get back to
          your beauty journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-left">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#A55166] font-bold ml-1 mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="hello@makeupmuse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-[#FCFAFA] border border-[#F2E8E4] rounded-2xl focus:border-[#A55166]/50 focus:outline-none transition-all text-[#3D3436] placeholder:text-[#b0ada3]"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#3D3436] text-white py-5 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#A55166] transition-all shadow-lg"
          >
            Send Reset Link
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-8 text-sm font-medium ${message.includes("Error") ? "text-red-400" : "text-[#A55166]"}`}
          >
            {message}
          </motion.p>
        )}

        <div className="mt-8 pt-6 border-t border-[#F2E8E4]">
          <a
            href="/login"
            className="text-xs font-bold text-[#7A6B6E] hover:text-[#A55166] transition-colors uppercase tracking-widest"
          >
            Back to Sign In
          </a>
        </div>
      </motion.div>
    </div>
  );
}
