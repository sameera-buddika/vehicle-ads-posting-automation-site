import Link from "next/link";

export function VehicleCard({ vehicle, onClick = null }) {
  // Verification badge component
  const VerificationBadge = () => {
    const status = vehicle.verification_status || 'pending';
    
    const badges = {
      verified: {
        text: 'Verified',
        icon: '✓',
        bg: 'bg-green-500',
        tooltip: 'AI Verified Listing'
      },
      manual_review: {
        text: 'Under Review',
        icon: '⚠',
        bg: 'bg-yellow-500',
        tooltip: 'Pending Manual Review'
      },
      failed: {
        text: 'Failed',
        icon: '✗',
        bg: 'bg-red-500',
        tooltip: 'Verification Failed'
      },
      in_progress: {
        text: 'Verifying...',
        icon: '⟳',
        bg: 'bg-blue-500',
        tooltip: 'Verification in Progress'
      },
      pending: {
        text: 'Pending',
        icon: '⏳',
        bg: 'bg-gray-500',
        tooltip: 'Awaiting Verification'
      }
    };

    const badge = badges[status] || badges.pending;
    
    return (
      <div className={`absolute top-2 right-2 ${badge.bg} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg`} title={badge.tooltip}>
        <span>{badge.icon}</span>
        <span>{badge.text}</span>
      </div>
    );
  };

  const content = (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden h-full">
      {/* Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
        <VerificationBadge />
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

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-700 mb-2 line-clamp-2">
          {vehicle.manufacturer} {vehicle.model}
        </h3>
        
        {vehicle.year && (
          <p className="text-gray-600 mb-2">Year: {vehicle.year}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {vehicle.vehicle_type && (
            <Badge color="purple">{vehicle.vehicle_type}</Badge>
          )}
          {vehicle.transmission && (
            <Badge color="blue">{vehicle.transmission}</Badge>
          )}
          {vehicle.fuel_type && (
            <Badge color="green">{vehicle.fuel_type}</Badge>
          )}
        </div>

        {vehicle.city && (
          <p className="text-sm text-gray-600 mb-2">📍 {vehicle.city}</p>
        )}
        
        {/* Verification Score */}
        {vehicle.verification_score !== null && vehicle.verification_score !== undefined && (
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Verification Score:</span>
              <span className={`text-xs font-bold ${
                vehicle.verification_score >= 70 ? 'text-green-600' :
                vehicle.verification_score >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {vehicle.verification_score.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-full rounded-full ${
                  vehicle.verification_score >= 70 ? 'bg-green-500' :
                  vehicle.verification_score >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${vehicle.verification_score}%` }}
              />
            </div>
          </div>
        )}

        {vehicle.price && (
          <p className="text-2xl font-bold text-green-600">
            LKR {parseFloat(vehicle.price).toLocaleString()}
          </p>
        )}

        <button className="mt-4 w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition">
          View Details
        </button>
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={() => onClick(vehicle)}>{content}</div>;
  }

  return <Link href={`/vehicles/${vehicle.id}`}>{content}</Link>;
}

export function VehicleListItem({ vehicle, onEdit, onDelete, onView }) {
  // Enhanced Verification badge component
  const VerificationBadge = () => {
    const status = vehicle.verification_status || 'pending';
    
    const badges = {
      verified: {
        text: 'AI Verified',
        icon: '✓',
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
        border: 'border-2 border-green-300',
        glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
        tooltip: 'AI Verified Listing - Quality Assured'
      },
      manual_review: {
        text: 'Under Review',
        icon: '⚠',
        bg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
        border: 'border-2 border-yellow-300',
        glow: 'shadow-[0_0_10px_rgba(234,179,8,0.4)]',
        tooltip: 'Pending Manual Review'
      },
      failed: {
        text: 'Verification Failed',
        icon: '✗',
        bg: 'bg-gradient-to-r from-red-500 to-rose-600',
        border: 'border-2 border-red-300',
        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.4)]',
        tooltip: 'Verification Failed - Please check details'
      },
      in_progress: {
        text: 'Verifying...',
        icon: '⟳',
        bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        border: 'border-2 border-blue-300',
        glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
        tooltip: 'Verification in Progress',
        animate: 'animate-spin'
      },
      pending: {
        text: 'Pending',
        icon: '⏳',
        bg: 'bg-gradient-to-r from-gray-500 to-slate-600',
        border: 'border-2 border-gray-300',
        glow: 'shadow-[0_0_8px_rgba(107,114,128,0.3)]',
        tooltip: 'Awaiting Verification'
      }
    };

    const badge = badges[status] || badges.pending;
    
    return (
      <div 
        className={`absolute top-3 right-3 ${badge.bg} ${badge.border} text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${badge.glow} z-10 transform hover:scale-105 transition-transform`} 
        title={badge.tooltip}
      >
        <span className={badge.animate || ''}>{badge.icon}</span>
        <span className="whitespace-nowrap">{badge.text}</span>
      </div>
    );
  };

  // Verification ribbon for verified vehicles
  const VerificationRibbon = () => {
    if (vehicle.verification_status !== 'verified') return null;
    
    return (
      <div className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 transform -rotate-12 origin-top-left shadow-lg z-10">
        <span className="flex items-center gap-1">
          <span>✓</span>
          <span>VERIFIED</span>
        </span>
      </div>
    );
  };

  // Verification status indicator for title
  const VerificationIndicator = () => {
    const status = vehicle.verification_status || 'pending';
    
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 ml-2 text-green-600" title="AI Verified Vehicle">
          <span className="text-lg">✓</span>
          <span className="text-xs font-semibold bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-64 h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
          <VerificationRibbon />
          <VerificationBadge />
          {vehicle.primary_image?.image_url ? (
            <img
              src={vehicle.primary_image.image_url}
              alt={`${vehicle.manufacturer} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0].image_url}
              alt={`${vehicle.manufacturer} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="text-6xl">🚗</span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-purple-700 mb-2 flex items-start">
                <span className="flex-1">
                  {vehicle.manufacturer} {vehicle.model}
                </span>
                <VerificationIndicator />
              </h3>
              {vehicle.year && (
                <p className="text-gray-600">Year: {vehicle.year}</p>
              )}
            </div>
            {vehicle.price && (
              <p className="text-2xl font-bold text-green-600 ml-4">
                LKR {parseFloat(vehicle.price).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {vehicle.vehicle_type && (
              <Badge color="purple">{vehicle.vehicle_type}</Badge>
            )}
            {vehicle.transmission && (
              <Badge color="blue">{vehicle.transmission}</Badge>
            )}
            {vehicle.fuel_type && (
              <Badge color="green">{vehicle.fuel_type}</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {vehicle.city && <span>📍 {vehicle.city}</span>}
            {vehicle.mileage && <span>🛣️ {vehicle.mileage} km</span>}
            {vehicle.engine_capacity && <span>⚙️ {vehicle.engine_capacity}</span>}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              Posted: {new Date(vehicle.created_at).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              {onView && (
                <button
                  onClick={() => onView(vehicle.id)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  👁️ View
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(vehicle.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  ✏️ Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(vehicle.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Badge({ children, color = "gray" }) {
  const colors = {
    purple: "bg-purple-100 text-purple-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`${colors[color]} text-xs px-2 py-1 rounded`}>
      {children}
    </span>
  );
}

