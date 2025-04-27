import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";
import Cookies from "js-cookie";
import {api} from '../utils/api'
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Only attempt to fetch if token exists but user not loaded
        if (Cookies.get("auth_token") && !isAuthenticated) {
          const res = await api.get("/api/auth/me", {
            withCredentials: true,
          });
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        console.error("Auth check failed", err);
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    dispatch(clearUser());
    navigate("/logout");
  };

  return (
    <nav className="w-full px-6 md:px-16 py-4 flex items-center justify-between bg-transparent text-white font-semibold">
      {/* Logo & Title */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold">RKV Sports</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-10 text-base">
        <Link to="/dashboard" className="hover:text-[#00ff88] transition">Home</Link>
        <Link to="/tournaments" className="hover:text-[#00ff88] transition">Tournaments</Link>
        
        {/* Conditionally render "Live Scores" or "Teams" link based on user role */}
        {user?.role === "coach" ? (
          <Link to="/coach" className="hover:text-[#00ff88] transition">Teams</Link>
        ) : (
          <Link to="/live" className="hover:text-[#00ff88] transition">Live Scores</Link>
        )}

        <Link to="/news" className="hover:text-[#00ff88] transition">News</Link>
        <Link to="/department" className="hover:text-[#00ff88] transition">Department</Link>
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile">
              <FaUserCircle className="text-2xl hover:text-[#00ff88] transition" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-white border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
