'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { vehicleAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { PageContainer, PageHeader, ContentContainer } from "../components/PageContainer";
import { Button } from "../components/Button";
import { Alert, EmptyState } from "../components/Alert";
import { VehicleListItem } from "../components/VehicleCard";
import LoadingSpinner, { SkeletonListItem } from "../components/LoadingSpinner";

export default function MyAdsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { startNavigating } = useNavigation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      fetchMyVehicles();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchMyVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleAPI.getVehicles(true);
      setVehicles(data);
    } catch (err) {
      setError("Failed to load your vehicles. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle ad?")) {
      return;
    }

    try {
      await vehicleAPI.deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
      alert("Vehicle ad deleted successfully!");
    } catch (err) {
      alert("Failed to delete vehicle ad. " + err.message);
    }
  };

  const handleView = (id) => {
    startNavigating();
    router.push(`/vehicles/${id}`);
  };
  
  const handleEdit = (id) => {
    startNavigating();
    router.push(`/vehicles/${id}/edit`);
  };
  
  const handlePostNew = () => {
    startNavigating();
    router.push("/post");
  };

  // Loading State
  if (authLoading || loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <div className="flex justify-between items-center mb-8 animate-pulse">
            <div>
              <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-6 bg-gray-100 rounded w-48"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-48"></div>
          </div>

          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your ads..." />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageContainer>
      <ContentContainer>
        {/* Header */}
        <PageHeader
          title="My Vehicle Ads"
          subtitle="Manage your vehicle listings"
          actions={
            <Button
              variant="warning"
              size="lg"
              onClick={handlePostNew}
            >
              🚗 Post New Vehicle
            </Button>
          }
        />
        
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Verification Status Information</p>
              <p className="text-sm text-blue-800">
                Only <span className="font-semibold text-green-600">✓ Verified</span> vehicles are visible in public listings. 
                Vehicles with <span className="font-semibold text-yellow-600">⚠ Under Review</span> or <span className="font-semibold text-red-600">✗ Failed</span> status 
                are only visible to you until verified.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError("")}
            className="mb-4"
          />
        )}

        {/* Content */}
        {vehicles.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No Ads Yet"
            message="You haven't posted any vehicle ads yet. Start by posting your first vehicle!"
            actionText="Post Your First Vehicle"
            onAction={handlePostNew}
          />
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing <span className="font-semibold">{vehicles.length}</span> vehicle{vehicles.length !== 1 ? 's' : ''}
            </div>
            
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <VehicleListItem
                  key={vehicle.id}
                  vehicle={vehicle}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(vehicle.id)}
                />
              ))}
            </div>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
}
