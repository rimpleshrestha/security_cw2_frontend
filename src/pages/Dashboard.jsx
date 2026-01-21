"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardImage from "../assets/images/dashboardimage.png";
import SkinTypeChart from "../assets/images/skintypechart.png"; // make sure this path is correct

const Dashboard = () => {
  const token = sessionStorage.getItem("access-token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/register"); // Redirect if no token
    }
  }, [token, navigate]);

  if (!token) return <></>;

  return (
    <div className="bg-gradient-to-b from-[#fad1e3] to-[#ff65aa]/10 min-h-[100vh] flex flex-col items-center py-12 relative">
      {/* Top section: text and button with image */}
      <div className="border-pink-300 border-0 border-b-2 w-full flex flex-col md:flex-row justify-between items-center pb-10">
        <div className="flex-1 flex flex-col items-center justify-end mt-16 md:mt-0">
          <h2
            className="text-[#A55166] text-xl md:text-4xl mb-6 text-center px-8 font-bold"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            To know your skin secrets, know your skin type
          </h2>

          <button
            onClick={() => navigate("/quiz")}
            className="bg-[#A55166] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#914257] transition"
            style={{ minWidth: "180px" }}
          >
            Take the Quiz
          </button>
        </div>

        <div className="flex-1 flex items-center justify-end w-full max-w-md md:max-w-none">
          <img
            src={DashboardImage || "/placeholder.svg"}
            alt="Dashboard"
            className="object-contain"
            style={{
              width: "350px",
              marginRight: 0,
              paddingRight: 0,
              display: "block",
            }}
          />
        </div>
      </div>

      {/* New section: chart below the pink line */}
      <div className="w-full flex justify-center mt-12 px-4">
        <img
          src={SkinTypeChart}
          alt="Skin Type Chart"
          className="object-contain"
          style={{
            maxWidth: "500px",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
