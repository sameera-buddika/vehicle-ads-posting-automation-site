import Link from "next/link";

export function VehicleCard({ vehicle, onClick = null }) {
  const content = (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden h-full">
      {/* Image */}
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
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-64 h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
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

        {/* Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-bold text-purple-700 mb-2">
                {vehicle.manufacturer} {vehicle.model}
              </h3>
              {vehicle.year && (
                <p className="text-gray-600">Year: {vehicle.year}</p>
              )}
            </div>
            {vehicle.price && (
              <p className="text-2xl font-bold text-green-600">
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

