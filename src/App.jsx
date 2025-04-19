import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout  from './components/Logout';
import LandingPage from './components/landingPage';
import Layout  from './components/Layout';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice";
import GoogleAuthSuccess from './components/GoogleAuthSuccess';
import { api } from './utils/api';



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me", { withCredentials: true });
        console.log("Response:", res.data);
        if (res.data.user) {
          dispatch(setUser(res.data.user)); // Populate redux store with user data
        }
      } catch (err) {
        console.error("Authentication failed:", err);
        dispatch(clearUser()); // Clear user from Redux store if authentication fails
      }
    };

    checkAuth();
  }, [dispatch]); // Added dispatch to dependencies for best practice
  return (
    <Router>
        <ToastContainer  position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light"/>

      <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/auth/success" element={<GoogleAuthSuccess/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
      </Route>
      </Routes>
    </Router>
  )
}

export default App;
