import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setProfileData, setUser } from "../redux/authSlice";
import { api } from "../utils/api";
import { Eye, EyeOff } from 'lucide-react';
import GoogleAuthButton from "./GoogleAuthButton";
import { Player } from "@lottiefiles/react-lottie-player";
import cricketAnim from "../assets/animations/cricket.json";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res=await api.post("/api/auth/login", formData, { withCredentials: true });
      console.log(res.data.user);
      dispatch(setProfileData(res.data.user));

      const userRes = await api.get("/api/auth/me", { withCredentials: true });
      dispatch(setUser(userRes.data.user));

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Try again.";
      setError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex w-full max-w-4xl">
        
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0c2d57]">Login to Your Account</h2>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-black pr-10 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00ff88] hover:bg-[#00e67a] text-black font-semibold py-3 rounded-md transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center justify-center text-gray-500 text-sm">or</div>
            <GoogleAuthButton />
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-[#00ff88] hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>

        {/* Right: Animation */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#0c2d57]">
          <Player
            autoplay
            loop
            src={cricketAnim}
            style={{ height: "400px", width: "400px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
