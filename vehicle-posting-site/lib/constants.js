// Vehicle Form Options
export const VEHICLE_TYPES = [
  { value: "Car", label: "Car" },
  { value: "SUV", label: "SUV" },
  { value: "Van", label: "Van" },
  { value: "Bike", label: "Bike" },
  { value: "Three-Wheeler", label: "Three-Wheeler" },
  { value: "Truck", label: "Truck" },
  { value: "Lorry", label: "Lorry" },
];

export const TRANSMISSION_TYPES = [
  { value: "Manual", label: "Manual" },
  { value: "Automatic", label: "Automatic" },
  { value: "Semi-Automatic", label: "Semi-Automatic" },
];

export const FUEL_TYPES = [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electric", label: "Electric" },
  { value: "Hybrid", label: "Hybrid" },
];

// Form validation helpers
export const validateVehicleForm = (formData) => {
  const errors = {};

  if (!formData.manufacturer?.trim()) {
    errors.manufacturer = "Manufacturer is required";
  }

  if (!formData.model?.trim()) {
    errors.model = "Model is required";
  }

  if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
    errors.year = "Please enter a valid year";
  }

  if (formData.price && parseFloat(formData.price) < 0) {
    errors.price = "Price must be a positive number";
  }

  return errors;
};

// Format helpers
export const formatPrice = (price) => {
  if (!price) return "N/A";
  return `LKR ${parseFloat(price).toLocaleString()}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

