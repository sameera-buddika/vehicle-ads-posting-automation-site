'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useNavigation } from "@/contexts/NavigationContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startNavigating } = useNavigation();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'expired'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided. Please check your email for the verification link.');
        setLoading(false);
        return;
      }

      try {
        const result = await authAPI.verifyEmail(token);
        
        if (result && result.message) {
          setStatus('success');
          setMessage(result.message || 'Email verified successfully! You can now log in.');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            startNavigating();
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        
        // Check if token is expired
        if (error.message && error.message.includes('expired')) {
          setStatus('expired');
          setMessage('Verification token has expired. Please request a new verification email.');
        } else {
          setStatus('error');
          setMessage(error.message || 'An error occurred during verification. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router, startNavigating]);

  const handleResendVerification = async () => {
    // We need the email, but we don't have it from the token
    // Redirect to resend page
    startNavigating();
    router.push('/resend-verification');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        {loading && status === 'verifying' && (
          <>
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700 mb-4"></div>
              <h1 className="text-2xl font-bold text-purple-700 mb-2">
                Verifying Your Email...
              </h1>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          </>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => {
                  startNavigating();
                  router.push('/login');
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {status === 'expired' && (
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-orange-700 mb-2">
              Token Expired
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => {
                  startNavigating();
                  router.push('/login');
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        <p className="text-center mt-6">
          <button
            onClick={() => {
              startNavigating();
              router.push('/');
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

