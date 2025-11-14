'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { vehicleAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import Navbar from "../../components/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { startNavigating } = useNavigation();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params?.id) {
      fetchVehicle();
    }
  }, [params?.id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehicleAPI.getVehicle(params.id);
      setVehicle(data);
    } catch (err) {
      setError("Failed to load vehicle details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle ad?")) {
      return;
    }

    try {
      await vehicleAPI.deleteVehicle(params.id);
      alert("Vehicle ad deleted successfully!");
      // Show loading bar and navigate
      startNavigating();
      router.push("/my-ads");
    } catch (err) {
      alert("Failed to delete vehicle ad. " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Back Button Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>

          {/* Loading Content */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Skeleton */}
              <div className="bg-gray-200 h-96 animate-pulse"></div>
              
              {/* Details Skeleton */}
              <div className="p-8 space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center mt-8">
            <LoadingSpinner size="lg" text="Loading vehicle details..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Vehicle not found"}
          </div>
          <button 
            onClick={() => {
              startNavigating();
              router.push("/vehicles");
            }}
            className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
          >
            ← Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && vehicle.posted_by === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => {
            startNavigating();
            router.push("/vehicles");
          }}
          className="mb-4 text-purple-700 hover:underline flex items-center"
        >
          ← Back to All Vehicles
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="bg-gray-200 p-8">
              {/* Primary/Main Image */}
              <div className="flex items-center justify-center mb-4">
                {vehicle.primary_image?.image_url ? (
                  <img
                    src={vehicle.primary_image.image_url}
                    alt={`${vehicle.manufacturer} ${vehicle.model}`}
                    className="w-full h-auto rounded-lg shadow-md max-h-96 object-contain"
                  />
                ) : vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[0].image_url}
                    alt={`${vehicle.manufacturer} ${vehicle.model}`}
                    className="w-full h-auto rounded-lg shadow-md max-h-96 object-contain"
                  />
                ) : vehicle.image_url ? (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.manufacturer} ${vehicle.model}`}
                    className="w-full h-auto rounded-lg shadow-md max-h-96 object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-9xl">🚗</span>
                    <p className="mt-4 text-gray-600">No image available</p>
                  </div>
                )}
              </div>
              
              {/* Additional Images Gallery */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {vehicle.images.slice(1, 4).map((image, index) => (
                    <img
                      key={image.id || index}
                      src={image.image_url}
                      alt={`${vehicle.manufacturer} ${vehicle.model} - Image ${index + 2}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition"
                      onClick={() => {
                        // Open image in new tab
                        window.open(image.image_url, '_blank');
                      }}
                    />
                  ))}
                  {vehicle.images.length > 4 && (
                    <div className="w-full h-24 bg-gray-300 rounded flex items-center justify-center text-gray-700 font-semibold">
                      +{vehicle.images.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-purple-700 mb-4">
                {vehicle.manufacturer} {vehicle.model}
              </h1>

              {vehicle.price && (
                <p className="text-3xl font-bold text-green-600 mb-6">
                  LKR {parseFloat(vehicle.price).toLocaleString()}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {vehicle.vehicle_type && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {vehicle.vehicle_type}
                  </span>
                )}
                {vehicle.transmission && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {vehicle.transmission}
                  </span>
                )}
                {vehicle.fuel_type && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {vehicle.fuel_type}
                  </span>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="space-y-3 mb-6">
                {vehicle.year && (
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-40">Year:</span>
                    <span className="text-gray-900">{vehicle.year}</span>
                  </div>
                )}
                {vehicle.city && (
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-40">Location:</span>
                    <span className="text-gray-900">📍 {vehicle.city}</span>
                  </div>
                )}
                {vehicle.plate_number && (
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-40">Plate Number:</span>
                    <span className="text-gray-900">{vehicle.plate_number}</span>
                  </div>
                )}
                {vehicle.engine_capacity && (
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-40">Engine Capacity:</span>
                    <span className="text-gray-900">{vehicle.engine_capacity}</span>
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-40">Mileage:</span>
                    <span className="text-gray-900">{vehicle.mileage} km</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-xl font-bold text-purple-700 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-gray-600">
                  Posted: {new Date(vehicle.created_at).toLocaleDateString()}
                </p>
                {vehicle.updated_at !== vehicle.created_at && (
                  <p className="text-sm text-gray-600">
                    Updated: {new Date(vehicle.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="mt-6 flex gap-4">
                  <button 
                    onClick={() => {
                      startNavigating();
                      router.push(`/vehicles/${vehicle.id}/edit`);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}

              {/* Contact Section (for non-owners) */}
              {!isOwner && (
                <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Interested in this vehicle?</h3>
                  <p className="text-gray-700">Please login to contact the seller.</p>
                  {!user && (
                    <button 
                      onClick={() => {
                        startNavigating();
                        router.push("/login");
                      }}
                      className="mt-3 bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
                    >
                      Login to Contact
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Vehicle Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Manufacturer</p>
              <p className="font-semibold text-gray-900">{vehicle.manufacturer}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Model</p>
              <p className="font-semibold text-gray-900">{vehicle.model}</p>
            </div>
            {vehicle.year && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold text-gray-900">{vehicle.year}</p>
              </div>
            )}
            {vehicle.transmission && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Transmission</p>
                <p className="font-semibold text-gray-900">{vehicle.transmission}</p>
              </div>
            )}
            {vehicle.fuel_type && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fuel Type</p>
                <p className="font-semibold text-gray-900">{vehicle.fuel_type}</p>
              </div>
            )}
            {vehicle.engine_capacity && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Engine Capacity</p>
                <p className="font-semibold text-gray-900">{vehicle.engine_capacity}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

