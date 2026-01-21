import React from "react";
import { useNavigate } from "react-router-dom";
import MakeupMuseLogo from "../assets/images/makeupmuse.jpg";
import MakeupHeroImage from "../assets/images/skinmuse_image.png";
import StarIcon from "../assets/images/star_skinmuse.svg";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-16 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FAD1E3] opacity-20 blur-[120px] rounded-full -mr-40 -mt-40"></div>

      <main className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
        {/* Left Side: Brand Narrative */}
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-8">
            <img src={StarIcon} alt="" className="w-6 h-6 animate-pulse" />
            <span className="text-[#A55166] uppercase tracking-[0.4em] text-xs font-bold">
              The Beauty Standard
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light text-[#332B2D] mb-8 leading-[1.05]"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            You Are Your <br />
            Own <span className="italic font-bold text-[#A55166]">Muse.</span>
          </h1>

          <p className="text-[#7A6B6E] text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-light">
            Stop guessing, start glowing. Our advanced diagnostic identifies
            your skin profile to curate the perfect makeup kit tailored uniquely
            to{" "}
            <span className="text-[#A55166] font-semibold text-nowrap underline underline-offset-4">
              you.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center w-full md:w-auto">
            <button
              onClick={() => navigate("/register")}
              className="bg-[#332B2D] text-white px-12 py-5 rounded-full font-bold tracking-[0.1em] text-xs hover:bg-[#A55166] transition-all duration-500 shadow-2xl shadow-black/10 w-full sm:w-auto"
            >
              CREATE YOUR PROFILE
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-[#A55166] text-xs font-bold tracking-widest uppercase hover:underline underline-offset-8 transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Social Proof Section */}
          <div className="mt-20 w-full">
            <div className="w-24 h-[1px] bg-[#A55166]/30 mb-6"></div>
            <p
              className="text-[#332B2D] text-2xl md:text-3xl font-light"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            >
              Over <span className="font-bold text-[#A55166]">500+</span>{" "}
              Artistry Profiles Created
            </p>
            <p className="text-[#A55166]/60 text-[10px] tracking-[0.3em] uppercase mt-2 font-bold">
              Join the community today
            </p>
          </div>
        </div>

        {/* Right Side: Hero Imagery */}
        <div className="flex-1 relative flex justify-center items-center">
          {/* Circular Frame for Image */}
          <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[550px] rounded-[100px] overflow-hidden shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-700">
            <img
              src={MakeupHeroImage}
              alt="MakeupMuse Editorial"
              className="w-full h-full object-cover scale-110"
            />
          </div>

          {/* Floating Aesthetic Element */}
          <div className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#F2E8E4] shadow-xl hidden lg:block transform -rotate-6">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[#A55166]">
                  ✦
                </span>
              ))}
            </div>
            <p className="text-[10px] font-bold text-[#332B2D] uppercase tracking-widest">
              Verified Recommendation
            </p>
          </div>
        </div>
      </main>

      {/* Subtle Footer Logo */}
      <div className="mt-20 opacity-20">
        <img src={MakeupMuseLogo} alt="" className="h-8 grayscale" />
      </div>
    </div>
  );
}
