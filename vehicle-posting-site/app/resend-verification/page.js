'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useNavigation } from "@/contexts/NavigationContext";

export default function ResendVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startNavigating } = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Pre-fill email from URL parameter if available
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.resendVerification(email);
      
      if (result && result.message) {
        setSuccess(true);
        setMessage(result.message || "Verification email has been sent. Please check your inbox.");
      } else {
        setError("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          📧 Resend Verification Email
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✅</span>
              <strong>Success!</strong>
            </div>
            <p>{message}</p>
            <p className="text-sm mt-2">Please check your email and spam folder.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!success && (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Enter your email address and we'll send you a new verification link. The link will expire in 1 hour.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 space-y-3">
          {success && (
            <button
              onClick={() => {
                startNavigating();
                router.push("/login");
              }}
              className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Go to Login
            </button>
          )}
          
          <button
            onClick={() => {
              startNavigating();
              router.push("/login");
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Back to Login
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
  );
}

