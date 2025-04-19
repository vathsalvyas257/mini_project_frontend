import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"; // ✅ Import this
import { setUser } from "../redux/authSlice"; // ✅ Import setUser
import { api } from "../utils/api"; // centralized Axios instance
import { Eye, EyeOff } from 'lucide-react';
import GoogleAuthButton from "./GoogleAuthButton";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Setup dispatch

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Login
      await api.post("/api/auth/login", formData, { withCredentials: true });

      // Step 2: Immediately get the user info via /me
      const userRes = await api.get("/api/auth/me", {
        withCredentials: true,
      });

      // Step 3: Store in Redux
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 text-black focus:outline-none"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:ring focus:ring-blue-200 focus:outline-none pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center justify-center my-2 text-gray-500 text-sm">or</div>
          <GoogleAuthButton />
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
