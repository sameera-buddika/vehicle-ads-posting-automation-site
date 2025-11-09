// app/register/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [frontId, setFrontId] = useState(null);
  const [backId, setBackId] = useState(null); // Fixed typo

  // Handle image preview
  const handleFrontIdChange = (e) => {
    setFrontId(URL.createObjectURL(e.target.files[0]));
  };
  const handleBackIdChange = (e) => {
    setBackId(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          📝 Create Your Account
        </h1>

        {/* Register Form */}
        <form className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-600 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Upload ID - Front */}
          <div>
            <label className="block text-gray-600 font-medium">Upload ID (Front)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFrontIdChange}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              required
            />
            {frontId && (
              <img
                src={frontId}
                alt="Front ID Preview"
                className="mt-2 w-40 rounded-lg border"
              />
            )}
          </div>

          {/* Upload ID - Back */}
          <div>
            <label className="block text-gray-600 font-medium">Upload ID (Back)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackIdChange}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              required
            />
            {backId && (
              <img
                src={backId}
                alt="Back ID Preview"
                className="mt-2 w-40 rounded-lg border"
              />
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-700 font-semibold hover:underline">
            Login
          </Link>
        </p>

        <p className="text-center mt-2">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
