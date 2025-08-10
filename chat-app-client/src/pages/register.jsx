import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../context/AuthContext";

axios.defaults.baseURL = backendUrl;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/user/auth/signup", formData);
      console.log("API response data:", data);

      if (data.success) {
        toast.success(data.message || "Signup successful");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-cover text-red-700 bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <Toaster position="top-right" />
      <img
        src="https://i.ibb.co/yF5Yt2zN/unnamed-removebg-preview.png"
        alt="Register Illustration"
        className="lg:w-[420px] md:w-[280px] w-full px-5"
      />

      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          name="fullName"
          className="p-2 border border-gray-500 rounded-md focus:outline-none"
          placeholder="Full Name"
          required
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
        />

        <textarea
          name="bio"
          rows={2}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
          placeholder="Provide short bio"
          required
          value={formData.bio}
          onChange={handleChange}
        ></textarea>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
          />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          Register
        </button>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium text-violet-400"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
