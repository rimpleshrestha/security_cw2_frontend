import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 h-full pt-[69px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
