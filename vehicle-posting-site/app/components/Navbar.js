'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Brand and Categories */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold hover:text-yellow-400 transition">
            🚗 VehicleAds
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/vehicles" className="hover:text-yellow-400 transition">All Vehicles</Link>
            <Link href="/vehicles?category=cars" className="hover:text-yellow-400 transition">Cars</Link>
            <Link href="/vehicles?category=suv" className="hover:text-yellow-400 transition">SUV</Link>
            <Link href="/vehicles?category=van" className="hover:text-yellow-400 transition">Van</Link>
            <Link href="/vehicles?category=bikes" className="hover:text-yellow-400 transition">Bikes</Link>
          </div>
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.name || user?.email}!</span>
              <Link href="/my-ads">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  📋 My Ads
                </button>
              </Link>
              <Link href="/post">
                <button className="bg-yellow-400 text-purple-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition">
                  🚗 Post Vehicle
                </button>
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-gray-200 text-purple-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                  🔑 Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  📝 Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
