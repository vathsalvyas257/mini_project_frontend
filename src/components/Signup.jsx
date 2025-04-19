import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { api } from "../utils/api";
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton";
import { Player } from "@lottiefiles/react-lottie-player";
import cricketAnim from "../assets/animations/cricket.json";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    try {
      await api.post(
        "/api/auth/signup",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      toast.success("Signup successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Try again.";
      setError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex w-full max-w-4xl">
        
        {/* Left: Animation */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#0c2d57]">
          <Player
            autoplay
            loop
            src={cricketAnim}
            style={{ height: "400px", width: "400px" }}
          />
        </div>

        {/* Right: Signup Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0c2d57]">Create an Account</h2>

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
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-black pr-10 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-black pr-10 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-[#00ff88]/60 cursor-not-allowed" : "bg-[#00ff88] hover:bg-[#00e67a]"
              } text-black font-semibold py-3 rounded-md transition`}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            <div className="flex items-center justify-center text-gray-500 text-sm">or</div>
            <GoogleAuthButton />
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-[#00ff88] hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
