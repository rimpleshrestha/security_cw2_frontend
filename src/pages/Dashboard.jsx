"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const token = sessionStorage.getItem("access-token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate]);

  if (!token) return <></>;

  return (
    <div className="bg-[#FAF8F7] min-h-[100vh] flex flex-col items-center py-16 px-6 font-sans">
      {/* Main Content Card */}
      <div className="max-w-6xl w-full bg-white rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-[#F2E8E4]">
        {/* Left Side: Editorial & CTA */}
        <div className="flex-[1.2] p-12 md:p-24 flex flex-col justify-center">
          <p className="text-[#A55166] text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
            <span className="w-10 h-[1px] bg-[#A55166]"></span>
            Personal Beauty Match
          </p>

          <h2
            className="text-[#332B2D] text-4xl md:text-6xl mb-8 leading-[1.15]"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            Curating your <br />
            <span className="italic font-light text-[#A55166]">
              entire
            </span>{" "}
            kit.
          </h2>

          <p className="text-[#7A6B6E] text-lg mb-12 max-w-sm leading-relaxed font-light">
            From the perfect primer for your pores to the blush pigment that
            won't fade. We analyze your skin type to recommend a full suite of
            products.
          </p>

          <button
            onClick={() => navigate("/quiz")}
            className="group flex items-center justify-between bg-[#332B2D] text-white px-8 py-5 rounded-2xl font-bold hover:bg-[#A55166] transition-all duration-500 w-full max-w-xs shadow-xl shadow-black/5"
          >
            <span>DISCOVER MY PRODUCTS</span>
            <span className="text-xl group-hover:translate-x-2 transition-transform">
              →
            </span>
          </button>
        </div>

        {/* Right Side: The "Full Kit" Visual */}
        <div className="flex-1 bg-gradient-to-br from-[#FDF2F0] to-[#FAD1E3]/20 p-12 flex flex-col justify-center relative">
          {/* Visual representation of a "Full Face" kit recommendations */}
          <div className="relative z-10 grid grid-cols-2 gap-4">
            {/* Lip Product Card */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm hover:translate-y-[-5px] transition-transform">
              <div className="w-full aspect-square bg-[#A55166]/10 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-2xl">💄</span>
              </div>
              <div className="h-1.5 w-12 bg-[#A55166]/40 rounded-full mb-1"></div>
              <div className="h-1.5 w-16 bg-[#A55166]/20 rounded-full"></div>
            </div>

            {/* Eye Product Card */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm mt-8 hover:translate-y-[-5px] transition-transform">
              <div className="w-full aspect-square bg-[#E6B8A2]/20 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="h-1.5 w-14 bg-[#A55166]/40 rounded-full mb-1"></div>
              <div className="h-1.5 w-10 bg-[#A55166]/20 rounded-full"></div>
            </div>

            {/* Base Product Card */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm -mt-4 hover:translate-y-[-5px] transition-transform">
              <div className="w-full aspect-square bg-[#D4A373]/20 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div className="h-1.5 w-10 bg-[#A55166]/40 rounded-full mb-1"></div>
              <div className="h-1.5 w-14 bg-[#A55166]/20 rounded-full"></div>
            </div>

            {/* Tool/Brush Card */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm mt-4 hover:translate-y-[-5px] transition-transform">
              <div className="w-full aspect-square bg-[#A55166]/5 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-2xl">🖌️</span>
              </div>
              <div className="h-1.5 w-16 bg-[#A55166]/40 rounded-full mb-1"></div>
              <div className="h-1.5 w-8 bg-[#A55166]/20 rounded-full"></div>
            </div>
          </div>

          {/* Centered Floating Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#332B2D] text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] shadow-2xl z-20">
            PERSONALIZED KIT
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl w-full mt-24">
        <h3 className="text-center text-[#A55166] text-xs font-bold tracking-[0.4em] uppercase mb-12">
          How it works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-[#332B2D] font-bold mb-2">Complexion</h4>
            <p className="text-xs text-[#8C7A7E]">
              Foundations & Primers matched to your oil levels.
            </p>
          </div>
          <div>
            <h4 className="text-[#332B2D] font-bold mb-2">Eyes</h4>
            <p className="text-xs text-[#8C7A7E]">
              Long-wear pigments that won't crease on your lid type.
            </p>
          </div>
          <div>
            <h4 className="text-[#332B2D] font-bold mb-2">Lips</h4>
            <p className="text-xs text-[#8C7A7E]">
              Hydrating or matte finishes based on your skin's moisture.
            </p>
          </div>
          <div>
            <h4 className="text-[#332B2D] font-bold mb-2">Finish</h4>
            <p className="text-xs text-[#8C7A7E]">
              Setting sprays and powders to lock in your specific look.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
