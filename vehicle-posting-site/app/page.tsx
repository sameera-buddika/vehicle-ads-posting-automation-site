'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { vehicleAPI } from "@/lib/api";
import { SkeletonCard } from "./components/LoadingSpinner";

export default function Home() {
  const [recentVehicles, setRecentVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    fetchRecentVehicles();
  }, []);

  const fetchRecentVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const data = await vehicleAPI.getVehicles();
      // Get only the 6 most recent vehicles
      setRecentVehicles(data.slice(0, 6));
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      // Don't show error to user on home page - just show empty state
      setRecentVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-700 mb-6">
            Find Your Perfect Vehicle
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Browse thousands of vehicles - Cars, SUVs, Vans, Bikes, Three-Wheels, Trucks, and Lorries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles">
              <button className="bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-purple-800 transition text-lg shadow-lg">
                🔍 Browse All Vehicles
              </button>
            </Link>
            <Link href="/post">
              <button className="bg-yellow-400 text-purple-900 font-semibold px-8 py-4 rounded-lg hover:bg-yellow-500 transition text-lg shadow-lg">
                🚗 Post Your Vehicle
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Cars", icon: "🚗", link: "/vehicles?type=car" },
            { name: "SUVs", icon: "🚙", link: "/vehicles?type=suv" },
            { name: "Vans", icon: "🚐", link: "/vehicles?type=van" },
            { name: "Bikes", icon: "🏍️", link: "/vehicles?type=bike" },
            { name: "Three-Wheels", icon: "🛺", link: "/vehicles?type=three-wheeler" },
            { name: "Trucks", icon: "🚚", link: "/vehicles?type=truck" },
          ].map((category) => (
            <Link key={category.name} href={category.link}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 text-center cursor-pointer transform hover:scale-105">
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-purple-700">Recent Listings</h2>
          <Link href="/vehicles" className="text-purple-700 hover:underline font-semibold">
            View All →
          </Link>
        </div>
        
        {loadingVehicles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recentVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {vehicle.primary_image?.image_url ? (
                      <img
                        src={vehicle.primary_image.image_url}
                        alt={`${vehicle.manufacturer} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0].image_url}
                        alt={`${vehicle.manufacturer} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">🚗</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">
                      {vehicle.manufacturer} {vehicle.model}
                    </h3>
                    {vehicle.year && (
                      <p className="text-gray-600 mb-2">Year: {vehicle.year}</p>
                    )}
                    {vehicle.price && (
                      <p className="text-2xl font-bold text-green-600">
                        LKR {parseFloat(vehicle.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No vehicles available at the moment.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-purple-700 mb-3">Easy to Use</h3>
            <p className="text-gray-600">
              Simple and intuitive interface to post and browse vehicle ads quickly
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-purple-700 mb-3">Secure</h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security measures
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-purple-700 mb-3">Fast</h3>
            <p className="text-gray-600">
              Lightning-fast search and filtering to find exactly what you need
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of users buying and selling vehicles every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition text-lg">
                Create Account
              </button>
            </Link>
            <Link href="/vehicles">
              <button className="bg-yellow-400 text-purple-900 font-semibold px-8 py-4 rounded-lg hover:bg-yellow-500 transition text-lg">
                Browse Vehicles
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">🚗 Vehicle Ads Posting Site</p>
          <p className="text-gray-300">
            Your trusted platform for buying and selling vehicles
          </p>
          <p className="text-sm text-gray-400 mt-4">
            © 2025 Vehicle Ads. All rights reserved.
          </p>
        </div>
      </footer>
   </div>
  );
}
