import React from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Added for navigation
import SkinmuseLogo from "../assets/images/skinMuseLogo.png";
import SkinmuseImage from "../assets/images/skinmuse_image.png";
import StarIcon from "../assets/images/star_skinmuse.svg";
import StarIcon1 from "../assets/images/star1_skinmuse.svg";

export default function Homepage() {
  const navigate = useNavigate(); // ⬅️ Initialize navigate function

  return (
    <div className=" bg-[#FFEDF5] h-full w-full flex justify-center items-center px-10 font-kaisei overflow-x-hidden overflow-clip">
      <main className="flex justify-between max-md:flex-wrap max-md:mt-32 gap-[30px] h-full w-full items-center  ">
        {/* Left side with star and text */}
        <div className="flex flex-col items-start text-left max-w-xl relative">
          <img
            src={StarIcon}
            alt="Star Icon"
            className="w-10 h-10 absolute -top-10 -left-6"
          />

          <h1 className="text-5xl font-bold text-pink-700 mb-4 mt-8">
            You Are Your Own Muse
          </h1>

          <p className="text-lg text-pink-900 mb-6 leading-relaxed">
            Understand your skin, discover the right products,
            <br />
            track what works, and be your own muse.
          </p>

          {/* Line + Happy Users + new star */}
          <div className="w-full flex flex-col items-center relative">
            <div className="w-full h-[1px] bg-gray-500 opacity-70 mt-12"></div>

            <img
              src={StarIcon1}
              alt="Star Icon"
              className="w-15h-15 absolute -top-10 right-0.5"
            />

            <p
              className="my-10 text-center text-gray-800 text-3xl"
              style={{
                fontFamily: "'Julius Sans One', sans-serif",
                fontWeight: "normal",
              }}
            >
              500 Happy Users, Are You Next?
            </p>

            <div className="w-full h-[1px] bg-gray-500 opacity-70"></div>

            {/* ⬇️ Sign Up Button with navigation */}
            <button
              onClick={() => navigate("/register")}
              className="mt-9 px-6 py-2 rounded-full border-2 border-[#A55166] text-[#A55166] hover:bg-[#A55166] hover:text-white transition duration-300 font-inter font-bold"
            >
              Sign Up Now!
            </button>
          </div>
        </div>

        {/* Right side image */}
        <img
          src={SkinmuseImage}
          alt="SkinMuse Illustration"
          className="h-[400px] w-auto mr-12"
        />
      </main>
    </div>
  );
}
