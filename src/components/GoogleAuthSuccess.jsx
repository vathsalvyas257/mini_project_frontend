// pages/GoogleAuthSuccess.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const GoogleAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me", {
          withCredentials: true,
        });
        dispatch(setUser(res.data.user));
        navigate("/dashboard"); // or wherever you want to send them
      } catch (err) {
        console.error("Google auth fetch failed", err);
        navigate("/login"); // fallback
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-white">
      Logging you in...
    </div>
  );
};

export default GoogleAuthSuccess;
