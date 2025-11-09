'use client';

import { useState, useEffect } from "react";
import { vehicleAPI } from "@/lib/api";
import { PageContainer, PageHeader, ContentContainer, Card } from "../components/PageContainer";
import { FormInput, FormSelect } from "../components/FormInput";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import { VehicleCard } from "../components/VehicleCard";
import { VEHICLE_TYPES } from "@/lib/constants";
import LoadingSpinner, { SkeletonCard } from "../components/LoadingSpinner";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, vehicleTypeFilter, minPrice, maxPrice, vehicles]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleAPI.getVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (err) {
      setError("Failed to load vehicles. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Vehicle type filter
    if (vehicleTypeFilter) {
      filtered = filtered.filter(
        (v) => v.vehicle_type?.toLowerCase() === vehicleTypeFilter.toLowerCase()
      );
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter((v) => parseFloat(v.price || 0) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((v) => parseFloat(v.price || 0) <= parseFloat(maxPrice));
    }

    setFilteredVehicles(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setVehicleTypeFilter("");
    setMinPrice("");
    setMaxPrice("");
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <Card className="mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded"></div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading vehicles..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">Browse Vehicles</h1>
          <p className="text-gray-600">Find your perfect vehicle from our listings</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔍 Filter Vehicles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              label="Search"
              placeholder="Search by manufacturer, model, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FormSelect
              label="Vehicle Type"
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              options={[{ value: "", label: "All Types" }, ...VEHICLE_TYPES]}
            />

            <FormInput
              label="Min Price (LKR)"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <FormInput
              label="Max Price (LKR)"
              type="number"
              placeholder="No limit"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredVehicles.length}</span> of{" "}
              <span className="font-semibold">{vehicles.length}</span> vehicles
            </p>
          </div>
        </Card>

        {/* Error Message */}
        {error && <Alert type="error" message={error} className="mb-4" />}

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No vehicles found matching your criteria.</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

