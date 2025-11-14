'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function VerificationModal({ 
  isOpen, 
  vehicleId, 
  verificationResult,
  onClose,
  onRetry 
}) {
  if (!isOpen) return null;

  const getStatusConfig = () => {
    const status = verificationResult?.verification_status || 'in_progress';
    
    const configs = {
      in_progress: {
        title: 'Verifying Your Vehicle...',
        icon: '🔍',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-900',
        showSpinner: true,
      },
      verified: {
        title: 'Verification Successful!',
        subtitle: 'Your vehicle listing has been verified and is ready to publish',
        icon: '✅',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-900',
        showSpinner: false,
      },
      manual_review: {
        title: 'Manual Review Required',
        subtitle: 'Your listing is pending admin review and will be published once approved',
        icon: '⚠️',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-900',
        showSpinner: false,
      },
      failed: {
        title: 'Verification Failed',
        subtitle: 'Your listing needs corrections before it can be verified',
        icon: '❌',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-900',
        showSpinner: false,
      },
      pending: {
        title: 'Pending Verification',
        icon: '⏳',
        color: 'gray',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-900',
        showSpinner: false,
      },
    };

    return configs[status] || configs.pending;
  };

  const config = getStatusConfig();
  const result = verificationResult?.verification_result;
  const score = result?.overall_confidence_score;

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${config.bgColor} border-b-2 ${config.borderColor} p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{config.icon}</span>
              <div>
                <h2 className={`text-2xl font-bold ${config.textColor}`}>
                  {config.title}
                </h2>
                {config.showSpinner && (
                  <p className="text-sm text-gray-600 mt-1">
                    Please wait while we verify your vehicle details...
                  </p>
                )}
                {config.subtitle && !config.showSpinner && (
                  <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
                    {config.subtitle}
                  </p>
                )}
              </div>
            </div>
            {!config.showSpinner && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Loading State */}
          {config.showSpinner && (
            <div className="flex flex-col items-center py-8">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">
                Analyzing your vehicle images with AI...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This usually takes 5-10 seconds
              </p>
            </div>
          )}

          {/* Verification Score */}
          {score !== undefined && score !== null && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Confidence Score:</span>
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score.toFixed(1)}%
                </span>
              </div>
              
              {/* Score Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full ${getScoreBarColor(score)} transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
              
              {/* Score Interpretation */}
              <div className="text-sm text-gray-600">
                {score >= 70 && (
                  <p className="text-green-600 font-medium">
                    ✓ Excellent match! Your listing has been verified successfully.
                  </p>
                )}
                {score >= 50 && score < 70 && (
                  <p className="text-yellow-600 font-medium">
                    ⚠ Good match, but requires manual review for final approval.
                  </p>
                )}
                {score < 50 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-red-800 font-semibold mb-1">
                      ✗ Verification Failed
                    </p>
                    <p className="text-red-700 text-sm">
                      The confidence score is below the required threshold. Please review the issues below and update your listing details or images.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Detection Results */}
          {result && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                AI Detection Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.ai_detected_brand && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Detected Brand</p>
                    <p className="font-semibold text-gray-800">{result.ai_detected_brand}</p>
                  </div>
                )}
                
                {result.ai_detected_model && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Detected Model</p>
                    <p className="font-semibold text-gray-800">{result.ai_detected_model}</p>
                  </div>
                )}
                
                {result.ai_detected_vehicle_type && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Detected Type</p>
                    <p className="font-semibold text-gray-800">{result.ai_detected_vehicle_type}</p>
                  </div>
                )}
                
                {result.ai_detected_fuel_type && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Detected Fuel Type</p>
                    <p className="font-semibold text-gray-800">{result.ai_detected_fuel_type}</p>
                  </div>
                )}
                
                {result.ai_detected_plate_number && (
                  <div className={`p-3 rounded-lg ${
                    result.plate_number_match_score === 100 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : result.plate_number_match_score !== null && result.plate_number_match_score < 100
                      ? 'bg-yellow-50 border-2 border-yellow-200'
                      : 'bg-gray-50'
                  }`}>
                    <p className="text-xs text-gray-500 uppercase">Detected Plate Number</p>
                    <p className="font-semibold text-gray-800">{result.ai_detected_plate_number}</p>
                    {result.plate_number_match_score === 100 && (
                      <p className="text-xs text-green-600 mt-1">✓ Matches provided plate number</p>
                    )}
                    {result.plate_number_match_score !== null && result.plate_number_match_score < 100 && (
                      <p className="text-xs text-yellow-600 mt-1">⚠ Does not match provided plate number</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Match Scores */}
          {result && (result.brand_match_score !== null || result.model_match_score !== null) && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Match Scores
              </h3>
              
              <div className="space-y-3">
                {result.brand_match_score !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Brand Match</span>
                      <span className={`font-semibold ${getScoreColor(result.brand_match_score)}`}>
                        {result.brand_match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBarColor(result.brand_match_score)} rounded-full`}
                        style={{ width: `${result.brand_match_score}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {result.model_match_score !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Model Match</span>
                      <span className={`font-semibold ${getScoreColor(result.model_match_score)}`}>
                        {result.model_match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBarColor(result.model_match_score)} rounded-full`}
                        style={{ width: `${result.model_match_score}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {result.vehicle_type_match_score !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Vehicle Type Match</span>
                      <span className={`font-semibold ${getScoreColor(result.vehicle_type_match_score)}`}>
                        {result.vehicle_type_match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBarColor(result.vehicle_type_match_score)} rounded-full`}
                        style={{ width: `${result.vehicle_type_match_score}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {result.fuel_type_match_score !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Fuel Type Match</span>
                      <span className={`font-semibold ${getScoreColor(result.fuel_type_match_score)}`}>
                        {result.fuel_type_match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBarColor(result.fuel_type_match_score)} rounded-full`}
                        style={{ width: `${result.fuel_type_match_score}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {result.plate_number_match_score !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center gap-2">
                        Plate Number Match
                        {result.plate_number_match_score === 100 && (
                          <span className="text-green-600">✓</span>
                        )}
                        {result.plate_number_match_score < 100 && (
                          <span className="text-yellow-600">⚠</span>
                        )}
                      </span>
                      <span className={`font-semibold ${getScoreColor(result.plate_number_match_score)}`}>
                        {result.plate_number_match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-full ${getScoreBarColor(result.plate_number_match_score)} rounded-full`}
                        style={{ width: `${result.plate_number_match_score}%` }}
                      />
                    </div>
                    {result.plate_number_match_score < 100 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Plate number mismatch detected. This will require manual review.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discrepancies */}
          {result?.discrepancies && result.discrepancies.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                <span>⚠️</span>
                <span>Issues Found</span>
              </h3>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {result.discrepancies.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-600 font-bold mt-0.5">✗</span>
                      <span className="font-medium">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Error Message for Failed Status */}
          {verificationResult?.verification_status === 'failed' && result?.error_message && (
            <div className="border-t pt-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-semibold text-lg mb-2 text-red-800 flex items-center gap-2">
                  <span>❌</span>
                  <span>Error Details</span>
                </h3>
                <p className="text-red-700 text-sm">{result.error_message}</p>
              </div>
            </div>
          )}

          {/* Not a Vehicle Image Warning */}
          {verificationResult?.verification_status === 'failed' && result?.is_vehicle_image === false && (
            <div className="border-t pt-6">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-red-800 flex items-center gap-2">
                  <span>🚫</span>
                  <span>Image Validation Failed</span>
                </h3>
                <p className="text-red-700 text-sm mb-2">
                  The uploaded images do not appear to show a vehicle. Please upload clear images of your vehicle.
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1 ml-2">
                  <li>Ensure images clearly show the vehicle</li>
                  <li>Remove any non-vehicle images</li>
                  <li>Use high-quality, well-lit photos</li>
                </ul>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {result?.ai_suggestions && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                <span>💡</span>
                <span>Suggestions to Improve</span>
              </h3>
              <div className={`p-4 rounded-lg ${
                verificationResult?.verification_status === 'failed' 
                  ? 'bg-yellow-50 border-2 border-yellow-300' 
                  : 'bg-blue-50'
              }`}>
                <p className={`text-sm ${
                  verificationResult?.verification_status === 'failed'
                    ? 'text-yellow-900 font-medium'
                    : 'text-gray-700'
                }`}>
                  {result.ai_suggestions}
                </p>
              </div>
            </div>
          )}

          {/* Failed Status Help Section */}
          {verificationResult?.verification_status === 'failed' && (
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-3 text-red-800 flex items-center gap-2">
                  <span>📋</span>
                  <span>What to Do Next</span>
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
                  <li className="font-medium">Review the issues and discrepancies listed above</li>
                  <li className="font-medium">Update your vehicle details to match the detected information</li>
                  <li className="font-medium">Upload clear, high-quality images of your vehicle</li>
                  <li className="font-medium">Click "Retry Verification" to verify again after making corrections</li>
                </ol>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!config.showSpinner && (() => {
            const status = verificationResult?.verification_status;
            
            return (
              <div className="border-t pt-6 flex gap-3">
                {status === 'manual_review' && onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    🔄 Retry Verification
                  </button>
                )}
                
                {status === 'verified' && (
                  <button
                    onClick={onClose}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    ✓ Continue to My Ads
                  </button>
                )}
                
                {status === 'manual_review' && (
                  <button
                    onClick={onClose}
                    className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition font-semibold"
                  >
                    Continue (Pending Review)
                  </button>
                )}
                
                {status === 'failed' && (
                  <>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <span>🔄</span>
                        <span>Retry Verification</span>
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Review & Edit Listing
                    </button>
                  </>
                )}
                
                {status !== 'verified' && status !== 'manual_review' && status !== 'failed' && (
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition font-semibold"
                  >
                    Close
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

