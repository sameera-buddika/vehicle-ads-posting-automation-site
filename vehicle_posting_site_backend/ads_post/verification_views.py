# ads_post/verification_views.py
"""
API Views for Vehicle Verification
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Vehicle, VehicleVerificationResult
from .serializers import VehicleVerificationResultSerializer
from .verification_service import VehicleVerificationService
from .views import get_user_id_from_request

import logging

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class VerifyVehicleView(APIView):
    """
    POST /api/vehicles/{vehicle_id}/verify/
    Trigger AI verification for a vehicle listing
    """
    
    def post(self, request, vehicle_id):
        """Initiate verification process"""
        try:
            # Check authentication
            user_id = get_user_id_from_request(request)
            
            # Get vehicle and verify ownership
            vehicle = get_object_or_404(Vehicle, id=vehicle_id)
            
            if vehicle.posted_by_id != user_id:
                return Response(
                    {'error': 'You do not have permission to verify this vehicle'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if vehicle has images
            if not vehicle.images.exists():
                return Response(
                    {
                        'error': 'Cannot verify vehicle without images',
                        'message': 'Please upload at least one image before verification'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if already verifying
            if vehicle.verification_status == 'in_progress':
                return Response(
                    {
                        'error': 'Verification already in progress',
                        'message': 'Please wait for the current verification to complete'
                    },
                    status=status.HTTP_409_CONFLICT
                )
            
            # Initialize verification service
            verification_service = VehicleVerificationService()
            
            # Perform verification
            success, result = verification_service.verify_vehicle(vehicle_id)
            
            if not success:
                return Response(
                    {
                        'success': False,
                        'error': result.get('error', 'Verification failed'),
                        'status': result.get('status', 'failed')
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Get the verification result
            verification_result = result['verification_result']
            serializer = VehicleVerificationResultSerializer(verification_result)
            
            return Response(
                {
                    'success': True,
                    'message': result.get('message', 'Verification completed'),
                    'verification_status': result.get('status'),
                    'verification_result': serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except AuthenticationFailed as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Error in verification: {str(e)}")
            return Response(
                {'error': 'Internal server error', 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerificationStatusView(APIView):
    """
    GET /api/vehicles/{vehicle_id}/verification-status/
    Get current verification status of a vehicle
    """
    
    def get(self, request, vehicle_id):
        """Get verification status and latest result"""
        try:
            vehicle = get_object_or_404(Vehicle, id=vehicle_id)
            
            # Initialize verification service
            verification_service = VehicleVerificationService()
            
            # Get status
            result = verification_service.get_verification_status(vehicle_id)
            
            if not result['success']:
                return Response(
                    {'error': result.get('error', 'Failed to get verification status')},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response(result['data'], status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting verification status: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerificationResultDetailView(APIView):
    """
    GET /api/verification-results/{result_id}/
    Get detailed verification result
    """
    
    def get(self, request, result_id):
        """Get detailed verification result"""
        try:
            verification_result = get_object_or_404(
                VehicleVerificationResult, 
                id=result_id
            )
            
            serializer = VehicleVerificationResultSerializer(verification_result)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting verification result: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VehicleVerificationHistoryView(APIView):
    """
    GET /api/vehicles/{vehicle_id}/verification-history/
    Get all verification attempts for a vehicle
    """
    
    def get(self, request, vehicle_id):
        """Get verification history"""
        try:
            vehicle = get_object_or_404(Vehicle, id=vehicle_id)
            
            # Get all verification results
            verification_results = vehicle.verification_results.all()
            
            serializer = VehicleVerificationResultSerializer(
                verification_results, 
                many=True
            )
            
            return Response(
                {
                    'vehicle_id': vehicle.id,
                    'total_attempts': vehicle.verification_attempts,
                    'current_status': vehicle.verification_status,
                    'is_verified': vehicle.is_verified,
                    'results': serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Error getting verification history: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class RetryVerificationView(APIView):
    """
    POST /api/vehicles/{vehicle_id}/retry-verification/
    Retry verification for a failed verification
    """
    
    def post(self, request, vehicle_id):
        """Retry verification"""
        try:
            # Check authentication
            user_id = get_user_id_from_request(request)
            
            # Get vehicle and verify ownership
            vehicle = get_object_or_404(Vehicle, id=vehicle_id)
            
            if vehicle.posted_by_id != user_id:
                return Response(
                    {'error': 'You do not have permission to retry verification for this vehicle'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check verification attempts limit
            MAX_ATTEMPTS = 5
            if vehicle.verification_attempts >= MAX_ATTEMPTS:
                return Response(
                    {
                        'error': f'Maximum verification attempts ({MAX_ATTEMPTS}) reached',
                        'message': 'Please contact support for manual review'
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            # Check if already verifying - allow retry if stuck in progress for too long
            # (more than 5 minutes without update)
            from datetime import timedelta
            
            if vehicle.verification_status == 'in_progress':
                # Check if verification has been stuck for more than 5 minutes
                if vehicle.last_verification_at:
                    time_since_verification = timezone.now() - vehicle.last_verification_at
                    if time_since_verification > timedelta(minutes=5):
                        # Reset stuck verification
                        vehicle.verification_status = 'pending'
                        vehicle.save()
                    else:
                        return Response(
                            {
                                'error': 'Verification already in progress',
                                'message': 'Please wait for the current verification to complete'
                            },
                            status=status.HTTP_409_CONFLICT
                        )
                else:
                    # No timestamp, assume stuck and allow retry
                    vehicle.verification_status = 'pending'
                    vehicle.save()
            else:
                # Reset to pending before retry
                vehicle.verification_status = 'pending'
                vehicle.save()
            
            # Initialize verification service
            verification_service = VehicleVerificationService()
            
            # Perform verification
            success, result = verification_service.verify_vehicle(vehicle_id)
            
            if not success:
                return Response(
                    {
                        'success': False,
                        'error': result.get('error', 'Verification failed'),
                        'status': result.get('status', 'failed')
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Get the verification result
            verification_result = result['verification_result']
            serializer = VehicleVerificationResultSerializer(verification_result)
            
            return Response(
                {
                    'success': True,
                    'message': 'Verification retry completed',
                    'verification_status': result.get('status'),
                    'attempts': vehicle.verification_attempts,
                    'verification_result': serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except AuthenticationFailed as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Error in retry verification: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class BulkVerificationView(APIView):
    """
    POST /api/vehicles/bulk-verify/
    Verify multiple vehicles at once (admin/owner only)
    """
    
    def post(self, request):
        """Bulk verify vehicles"""
        try:
            # Check authentication
            user_id = get_user_id_from_request(request)
            
            # Get vehicle IDs from request
            vehicle_ids = request.data.get('vehicle_ids', [])
            
            if not vehicle_ids:
                return Response(
                    {'error': 'No vehicle IDs provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Initialize verification service
            verification_service = VehicleVerificationService()
            
            results = []
            
            for vehicle_id in vehicle_ids:
                try:
                    # Get vehicle and verify ownership
                    vehicle = Vehicle.objects.get(id=vehicle_id)
                    
                    if vehicle.posted_by_id != user_id:
                        results.append({
                            'vehicle_id': vehicle_id,
                            'success': False,
                            'error': 'Permission denied'
                        })
                        continue
                    
                    # Perform verification
                    success, result = verification_service.verify_vehicle(vehicle_id)
                    
                    results.append({
                        'vehicle_id': vehicle_id,
                        'success': success,
                        'status': result.get('status'),
                        'message': result.get('message') if success else result.get('error')
                    })
                    
                except Vehicle.DoesNotExist:
                    results.append({
                        'vehicle_id': vehicle_id,
                        'success': False,
                        'error': 'Vehicle not found'
                    })
                except Exception as e:
                    results.append({
                        'vehicle_id': vehicle_id,
                        'success': False,
                        'error': str(e)
                    })
            
            return Response(
                {
                    'total': len(vehicle_ids),
                    'results': results
                },
                status=status.HTTP_200_OK
            )
            
        except AuthenticationFailed as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Error in bulk verification: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

