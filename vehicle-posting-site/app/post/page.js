"use client";
import { useState } from "react";

export default function PostVehicle() {
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    city: "", // added city
    year: "",
    type: "",
    engine: "",
    transmission: "",
    fuel: "",
    mileage: "",
    price: "",
    vehicleNumber: "", // added vehicle number plate
  });

  const [vehicleImage, setVehicleImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setVehicleImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (vehicleImage) {
      data.append("vehicleImage", vehicleImage);
    }

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Vehicle submitted successfully!");
        setFormData({
          manufacturer: "",
          model: "",
          city: "",
          year: "",
          type: "",
          engine: "",
          transmission: "",
          fuel: "",
          mileage: "",
          price: "",
          vehicleNumber: "",
        });
        setVehicleImage(null);
      } else {
        alert("Failed to submit vehicle.");
      }
    } catch (error) {
      console.error("Error submitting vehicle:", error);
      alert("An error occurred while submitting.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          🚗 Post Your Vehicle
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Manufacturer */}
          <input
            type="text"
            name="manufacturer"
            placeholder="Manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Model */}
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* City */}
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Vehicle Number Plate */}
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number Plate (e.g., ABC-1234)"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Year */}
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Type */}
          <input
            type="text"
            name="type"
            placeholder="Vehicle Type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Engine */}
          <input
            type="number"
            name="engine"
            placeholder="Engine Capacity (cc)"
            value={formData.engine}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Transmission */}
          <input
            type="text"
            name="transmission"
            placeholder="Transmission (Auto/Manual)"
            value={formData.transmission}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Fuel */}
          <input
            type="text"
            name="fuel"
            placeholder="Fuel Type (Petrol/Diesel/Electric)"
            value={formData.fuel}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Mileage */}
          <input
            type="number"
            name="mileage"
            placeholder="Mileage (km)"
            value={formData.mileage}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Image upload */}
          <div>
            <label className="block text-gray-600 font-medium">Vehicle Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-purple-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            Submit Vehicle Info
          </button>
        </form>
      </div>
    </div>
  );
}
