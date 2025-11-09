// API Configuration and Service Layer
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get auth token from cookies
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
  return jwtCookie ? jwtCookie.split('=')[1] : null;
};

// Generic fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
  };

  // Only add Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response types
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      // Don't log 401 errors - they're expected when not logged in
      if (response.status !== 401) {
        console.error('API Error:', data.detail || data.message || 'API request failed');
      }
      throw new Error(data.detail || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    // Only log unexpected errors, not 401/authentication errors
    if (!error.message.includes('Unauthenticated') && !error.message.includes('Token')) {
      console.error('API Error:', error);
    }
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiFetch('/api/auth/user', {
      method: 'GET',
    });
  },

  getAllUsers: async () => {
    return apiFetch('/api/auth/register', {
      method: 'GET',
    });
  },
};

// Vehicle API
export const vehicleAPI = {
  // Get all vehicles or filter by 'mine'
  getVehicles: async (mine = false) => {
    const query = mine ? '?mine=true' : '';
    return apiFetch(`/api/vehicles/${query}`, {
      method: 'GET',
    });
  },

  // Get single vehicle by ID
  getVehicle: async (id) => {
    return apiFetch(`/api/vehicles/${id}/`, {
      method: 'GET',
    });
  },

  // Create new vehicle ad
  createVehicle: async (vehicleData) => {
    return apiFetch('/api/vehicles/', {
      method: 'POST',
      body: vehicleData, // FormData object with multiple images
    });
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    return apiFetch(`/api/vehicles/${id}/`, {
      method: 'PUT',
      body: vehicleData, // FormData object
    });
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    return apiFetch(`/api/vehicles/${id}/`, {
      method: 'DELETE',
    });
  },

  // Delete individual image
  deleteVehicleImage: async (imageId) => {
    return apiFetch(`/api/vehicles/images/${imageId}/`, {
      method: 'DELETE',
    });
  },

  // Get vehicle categories
  getCategories: async () => {
    return apiFetch('/api/vehicles/categories/', {
      method: 'GET',
    });
  },

  // Verification APIs
  verifyVehicle: async (vehicleId) => {
    return apiFetch(`/api/vehicles/${vehicleId}/verify/`, {
      method: 'POST',
    });
  },

  getVerificationStatus: async (vehicleId) => {
    return apiFetch(`/api/vehicles/${vehicleId}/verification-status/`, {
      method: 'GET',
    });
  },

  getVerificationHistory: async (vehicleId) => {
    return apiFetch(`/api/vehicles/${vehicleId}/verification-history/`, {
      method: 'GET',
    });
  },

  retryVerification: async (vehicleId) => {
    return apiFetch(`/api/vehicles/${vehicleId}/retry-verification/`, {
      method: 'POST',
    });
  },
};

export default { authAPI, vehicleAPI };

