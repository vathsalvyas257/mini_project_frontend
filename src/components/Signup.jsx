import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { api } from '../utils/api'
import { Eye, EyeOff } from 'lucide-react'
import GoogleAuthButton from './GoogleAuthButton'
import axios from 'axios'
import { setUser } from '../redux/authSlice'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      const message = 'Passwords do not match.'
      setError(message)
      toast.error(message)
      setLoading(false)
      return
    }

    try {
      await api.post('/api/auth/signup', {
        email: formData.email,
        password: formData.password,
      }, {
        withCredentials: true,
      })

      toast.success('Signup successful! Redirecting...')

      // // Immediately get the user
      // const userRes = await axios.get("http://localhost:8080/api/auth/me", { withCredentials: true });
      // dispatch(setUser(userRes.data.user))

      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Try again.'
      setError(message)
      toast.error(message)
    }

    setLoading(false)
  }

  // const handleGoogleSuccess = async () => {
  //   try {
  //     const userRes = await axios.get("http://localhost:8080/api/auth/me", { withCredentials: true });
  //     dispatch(setUser(userRes.data.user));
  //     toast.success("Logged in with Google!");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     toast.error("Failed to get user data.");
  //   }
  // }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="w-full p-2 border border-gray-300 rounded pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="w-full p-2 border border-gray-300 rounded pr-10"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold py-2 px-4 rounded transition`}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>

        <div className="flex items-center justify-center my-2 text-gray-500 text-sm">or</div>

        {/* ✅ Google Auth Button with callback */}
        <GoogleAuthButton />
      </form>
    </div>
  )
}

export default Signup
