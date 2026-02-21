"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "", // Changed from fullName to name to match User.js
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default value from User.js
  });

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3)
      newErrors.name = "Name is required (min 3 chars)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "10-digit phone number required";
    if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Instead of alert, we show the dialog
          setShowOTPDialog(true);
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (error) {
        alert("Server connection failed");
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // Send all user details
          otp: otp, // Send the code entered in the dialog
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account verified and created successfully!");
        setShowOTPDialog(false);
        window.location.href = "/signin"; // Redirect to sign in
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-400">Join the HostelWala Network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-300 mb-1.5 font-medium text-sm">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.name ? "border-red-500" : "border-gray-600"} rounded-lg text-white focus:outline-none focus:border-slate-500 transition-colors`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.email ? "border-red-500" : "border-gray-600"} rounded-lg text-white focus:outline-none focus:border-slate-500 text-sm`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Mobile field */}
                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium text-sm">
                    Mobile
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.phone ? "border-red-500" : "border-gray-600"} rounded-lg text-white focus:outline-none focus:border-slate-500 text-sm`}
                      placeholder="10-digit number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-gray-300 mb-1.5 font-medium text-sm">
                  Account Type
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slate-500 appearance-none cursor-pointer"
                  >
                    <option value="user" className="bg-gray-900 text-white">
                      General User / Student
                    </option>

                    <option
                      value="hostel_authority"
                      className="bg-gray-900 text-white"
                    >
                      Hostel Authority
                    </option>
                    <option
                      value="central_authority"
                      className="bg-gray-900 text-white"
                    >
                      Central Authority
                    </option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.password ? "border-red-500" : "border-gray-600"} rounded-lg text-white focus:outline-none focus:border-slate-500 text-sm`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium text-sm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.confirmPassword ? "border-red-500" : "border-gray-600"} rounded-lg text-white focus:outline-none focus:border-slate-500 text-sm`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="group w-full py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 mt-4"
              >
                Create Account
                <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-white font-semibold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* OTP Dialog Overlay */}
      {showOTPDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Enter the 6-digit code sent to {formData.email}
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-3xl tracking-[10px] py-3 bg-gray-900 border border-gray-600 rounded-lg text-white mb-6 focus:border-slate-500 focus:outline-none"
              placeholder="000000"
            />

            <button
              onClick={handleVerifyOTP}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
            >
              Verify & Register
            </button>

            <button
              onClick={() => setShowOTPDialog(false)}
              className="mt-4 text-gray-500 hover:text-white text-sm"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
