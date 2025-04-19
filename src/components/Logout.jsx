import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../utils/api"; // your axios instance

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Local loading state

  useEffect(() => {
    const logout = async () => {
      setLoading(true);  // Set loading to true before API call
      try {
        const response = await api.post("/api/auth/logout");
        toast.success(response.data.message || "Logged out successfully");  // Show toast only once
        navigate("/login");  // Redirect to login page
      } catch (err) {
        toast.error("Logout failed");  // Show error toast if logout fails
        console.error(err);
      } finally {
        setLoading(false);  // Set loading to false after API call completes
      }
    };

    logout();  // Call the logout function when the component mounts
  }, [navigate]);  // Empty dependency array means this effect runs only once

  if (loading) {
    return <div className="text-center mt-10">Logging out...</div>;  // Show loading message
  }

  return null;  // If not loading, render nothing (logout is complete)
};

export default Logout;
