import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import cricketAnim from "../assets/animations/cricket.json";
import sportAnim from "../assets/animations/sport.json";
import badmintonAnim from "../assets/animations/badminton.json";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10">
      
      {/* Left Section */}
      <div className="text-white flex-1 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
          <span className="text-[#00ff88]">Unleash</span> Your Athletic Spirit
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl">
          Dive into the ultimate campus sports experience — from cricket battles to badminton smashes. RKV Sports is your all-access pass to excitement.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/tournaments")}
            className="bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold px-6 py-3 rounded-full shadow-md transition duration-300"
          >
            Explore Tournaments
          </button>
          <button
            onClick={() => navigate("/registration")}
            className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-semibold px-6 py-3 rounded-full transition duration-300"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Right Section - Animations */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 items-center justify-center">
        <Player
          autoplay
          loop
          src={badmintonAnim}
          style={{ height: "700px", width: "600px" }}
        />
        {/* <Player
          autoplay
          loop
          src={cricketAnim}
          style={{ height: "400px", width: "350px" }}
        /> */}
      </div>
    </div>
  );
};

export default LandingPage;
