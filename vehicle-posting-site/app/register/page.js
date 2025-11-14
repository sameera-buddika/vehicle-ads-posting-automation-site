'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { startNavigating } = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    nic_image_link: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        nic_image_link: formData.nic_image_link,
      };

      const result = await register(userData);
      
      if (result.success) {
        // Show verification message instead of redirecting
        setRegistrationSuccess(true);
        setRegisteredEmail(formData.email);
        setLoading(false);
      } else {
        setError(result.error || "Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Show verification message after successful registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 py-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">
              Check Your Email!
            </h1>
            <p className="text-gray-600 mb-4">
              We've sent a verification email to <strong>{registeredEmail}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Please click the verification link in the email to activate your account. The link will expire in 1 hour.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Didn't receive the email?</strong> Check your spam folder or click the button below to resend.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  startNavigating();
                  router.push(`/resend-verification?email=${encodeURIComponent(registeredEmail)}`);
                }}
                className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => {
                  startNavigating();
                  router.push("/login");
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Go to Login
              </button>
            </div>
            <p className="text-center mt-6">
              <button
                onClick={() => {
                  startNavigating();
                  router.push("/");
                }}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back to Home
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          📝 Create Your Account
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">NIC Image Link (Optional)</label>
            <input
              type="url"
              name="nic_image_link"
              placeholder="Enter NIC image URL (optional)"
              value={formData.nic_image_link}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">You can upload your NIC to a cloud service and paste the link here</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button 
            onClick={() => {
              startNavigating();
              router.push("/login");
            }}
            className="text-purple-700 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

        <p className="text-center mt-4">
          <button 
            onClick={() => {
              startNavigating();
              router.push("/");
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}
