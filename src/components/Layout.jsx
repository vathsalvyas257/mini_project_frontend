import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      <Outlet /> {/* This is where the page content will render */}
    </div>
  );
};

export default Layout;
