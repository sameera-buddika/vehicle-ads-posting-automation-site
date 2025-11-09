'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { startNavigating } = useNavigation();

  const handleNavigation = (path) => {
    startNavigating();
    router.push(path);
  };

  const handleLogout = async () => {
    startNavigating();
    await logout();
  };

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Brand and Categories */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => handleNavigation("/")}
            className="text-2xl font-bold hover:text-yellow-400 transition-all duration-200 active:scale-95 transform"
          >
            🚗 VehicleAds
          </button>
          <div className="hidden md:flex space-x-4">
            <button onClick={() => handleNavigation("/vehicles")} className="hover:text-yellow-400 transition-all duration-200 active:scale-95 transform">All Vehicles</button>
            <button onClick={() => handleNavigation("/vehicles?category=cars")} className="hover:text-yellow-400 transition-all duration-200 active:scale-95 transform">Cars</button>
            <button onClick={() => handleNavigation("/vehicles?category=suv")} className="hover:text-yellow-400 transition-all duration-200 active:scale-95 transform">SUV</button>
            <button onClick={() => handleNavigation("/vehicles?category=van")} className="hover:text-yellow-400 transition-all duration-200 active:scale-95 transform">Van</button>
            <button onClick={() => handleNavigation("/vehicles?category=bikes")} className="hover:text-yellow-400 transition-all duration-200 active:scale-95 transform">Bikes</button>
          </div>
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.name || user?.email}!</span>
              <button 
                onClick={() => handleNavigation("/my-ads")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:shadow-lg transition-all duration-200 active:scale-95 transform"
              >
                📋 My Ads
              </button>
              <button 
                onClick={() => handleNavigation("/post")}
                className="bg-yellow-400 text-purple-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 hover:shadow-lg transition-all duration-200 active:scale-95 transform"
              >
                🚗 Post Vehicle
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-lg transition-all duration-200 active:scale-95 transform"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavigation("/login")}
                className="bg-gray-200 text-purple-900 px-4 py-2 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all duration-200 active:scale-95 transform"
              >
                🔑 Login
              </button>
              <button 
                onClick={() => handleNavigation("/register")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition-all duration-200 active:scale-95 transform"
              >
                📝 Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
