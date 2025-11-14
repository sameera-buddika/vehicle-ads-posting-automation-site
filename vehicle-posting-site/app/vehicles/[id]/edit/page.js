'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { vehicleAPI } from "@/lib/api";
import Navbar from "../../../components/Navbar";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
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
    description: "",
  });
  
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated && params?.id) {
      fetchVehicle();
    }
  }, [isAuthenticated, authLoading, params?.id, router]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehicleAPI.getVehicle(params.id);
      
      // Populate form data
      setFormData({
        manufacturer: data.manufacturer || "",
        model: data.model || "",
        city: data.city || "",
        plate_number: data.plate_number || "",
        year: data.year || "",
        vehicle_type: data.vehicle_type || "",
        engine_capacity: data.engine_capacity || "",
        transmission: data.transmission || "",
        fuel_type: data.fuel_type || "",
        mileage: data.mileage || "",
        price: data.price || "",
        description: data.description || "",
      });
      
      // Set current image - check multiple possible sources
      const imageUrl = data.primary_image?.image_url || 
                       (data.images && data.images.length > 0 ? data.images[0].image_url : null) ||
                       data.image_url;
      setCurrentImage(imageUrl);
    } catch (err) {
      setError("Failed to load vehicle. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVehicleImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      // Append new image if exists
      if (vehicleImage) {
        data.append("image", vehicleImage);
      }

      await vehicleAPI.updateVehicle(params.id, data);
      
      alert("Vehicle updated successfully!");
      // Show loading bar and navigate
      startNavigating();
      router.push("/my-ads");
      
    } catch (err) {
      // Handle duplicate plate number error
      const errorMessage = err.detail || err.message || "Failed to update vehicle. Please try again.";
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
            {/* Header Skeleton */}
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>

            {/* Form Skeleton */}
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-12 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Spinner */}
            <div className="flex justify-center mt-12">
              <LoadingSpinner size="lg" text="Loading vehicle data..." />
            </div>
          </div>
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
            ✏️ Edit Vehicle
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
                <label className="block text-gray-700 font-medium mb-2">
                  Plate Number <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-500 font-normal ml-2">(Must be unique)</span>
                </label>
                <input
                  type="text"
                  name="plate_number"
                  placeholder="e.g., ABC-1234"
                  value={formData.plate_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each vehicle must have a unique plate number
                </p>
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

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Provide a detailed description of your vehicle (condition, features, history, etc.)"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-vertical"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Vehicle Image</label>
              
              {/* Current Image */}
              {currentImage && !imagePreview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={currentImage}
                    alt="Current vehicle"
                    className="max-w-md rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
              
              {/* New Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="New preview"
                    className="max-w-md rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white font-bold text-lg px-6 py-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Updating..." : "✏️ Update Vehicle"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

