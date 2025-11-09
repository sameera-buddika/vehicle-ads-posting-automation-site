'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { vehicleAPI } from "@/lib/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PostVehicle() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { startNavigating } = useNavigation();
  
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    city: "",
    plate_number: "",
    year: "",
    vehicle_type: "",
    engine_capacity: "",
    transmission: "",
    fuel_type: "",
    mileage: "",
    price: "",
  });
  
  const [vehicleImages, setVehicleImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVehicleImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index) => {
    const newImages = vehicleImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setVehicleImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      // Append images if exist
      vehicleImages.forEach((image) => {
        data.append("images", image);
      });

      await vehicleAPI.createVehicle(data);
      
      alert("Vehicle posted successfully!");
      // Show loading bar and navigate
      startNavigating();
      router.push("/my-ads");
      
    } catch (err) {
      setError(err.message || "Failed to post vehicle. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Checking authentication..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
            🚗 Post Your Vehicle
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Manufacturer *</label>
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="e.g., Toyota, Honda"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g., Civic, Corolla"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g., Colombo"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Plate Number</label>
                <input
                  type="text"
                  name="plate_number"
                  placeholder="e.g., ABC-1234"
                  value={formData.plate_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  placeholder="e.g., 2020"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Vehicle Type</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Bike">Bike</option>
                  <option value="Three-Wheeler">Three-Wheeler</option>
                  <option value="Truck">Truck</option>
                  <option value="Lorry">Lorry</option>
                </select>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Engine Capacity</label>
                <input
                  type="text"
                  name="engine_capacity"
                  placeholder="e.g., 1500cc"
                  value={formData.engine_capacity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Mileage (km)</label>
                <input
                  type="text"
                  name="mileage"
                  placeholder="e.g., 50000"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price (LKR)</label>
              <input
                type="number"
                name="price"
                placeholder="e.g., 5000000"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Vehicle Images (Multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Select multiple images (first image will be primary)</p>
              
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-purple-900 font-bold text-lg px-6 py-4 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "🚗 Post Vehicle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
