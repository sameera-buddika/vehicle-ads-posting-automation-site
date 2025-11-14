from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import UserSerializer
from .models import User
from .utils import send_verification_email
import jwt, datetime
import logging

# Get logger for this module
logger = logging.getLogger('users.views')


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        # Log incoming request
        logger.info("=" * 80)
        logger.info("REGISTRATION REQUEST RECEIVED")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Content-Type: {request.content_type}")
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request data type: {type(request.data)}")
        
        # Log raw request body if available
        try:
            if hasattr(request, 'body'):
                logger.info(f"Request body (raw): {request.body}")
        except Exception as e:
            logger.warning(f"Could not log request body: {str(e)}")
        
        try:
            serializer = UserSerializer(data=request.data)
            
            # Log validation attempt
            logger.info("Attempting to validate serializer...")
            
            if not serializer.is_valid():
                # Log validation errors in detail
                logger.error("VALIDATION FAILED")
                logger.error(f"Validation errors: {serializer.errors}")
                
                # Format error messages for better readability
                error_messages = []
                for field, errors in serializer.errors.items():
                    logger.error(f"Field '{field}' errors: {errors}")
                    if isinstance(errors, list):
                        for error in errors:
                            if 'unique' in str(error).lower() or 'already exists' in str(error).lower():
                                if field == 'email':
                                    error_messages.append('This email address is already registered. Please use a different email or try logging in.')
                                else:
                                    error_messages.append(f'{field}: {error}')
                            else:
                                error_messages.append(f'{field}: {error}')
                    else:
                        error_messages.append(f'{field}: {errors}')
                
                logger.error(f"Formatted error messages: {error_messages}")
                logger.error("=" * 80)
                
                return Response({
                    'error': 'Validation failed',
                    'message': ' '.join(error_messages) if error_messages else 'Invalid data provided',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            logger.info("Validation passed. Creating user...")
            
            user = serializer.save()
            logger.info(f"User created with ID: {user.id}, Email: {user.email}")
            
            # Set user as inactive until email is verified
            user.is_active = False
            user.is_verified = False
            user.save()
            logger.info("User set as inactive and unverified")
            
            # Generate verification token
            verification_token = user.generate_verification_token()
            logger.info(f"Verification token generated: {verification_token[:20]}...")
            
            # Send verification email
            logger.info("Attempting to send verification email...")
            email_sent = send_verification_email(user, verification_token)
            
            if email_sent:
                logger.info(f"Registration successful! Verification email sent to {user.email}")
                logger.info("=" * 80)
                return Response({
                    'message': 'Registration successful! Please check your email to verify your account.',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Registration successful but email failed to send for {user.email}")
                logger.info("=" * 80)
                # If email fails, still create user but return warning
                return Response({
                    'message': 'Registration successful, but verification email could not be sent. Please contact support.',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                    }
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log the full exception with traceback
            logger.exception(f"EXCEPTION OCCURRED DURING REGISTRATION: {str(e)}")
            logger.error(f"Exception type: {type(e).__name__}")
            logger.error("=" * 80)
            
            # Catch any unexpected errors
            return Response({
                'error': 'Registration failed',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        
        # Check if user has verified their email
        if not user.is_verified:
            raise AuthenticationFailed('Please verify your email address before logging in. Check your email for the verification link.')
        
        # Check if user is active
        if not user.is_active:
            raise AuthenticationFailed('Your account is inactive. Please contact support.')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        from django.conf import settings
        jwt_secret = getattr(settings, 'JWT_SECRET', settings.SECRET_KEY)
        token = jwt.encode(payload, jwt_secret, algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            return Response({'detail': 'Unauthenticated!'}, status=401)

        try:
            from django.conf import settings
            jwt_secret = getattr(settings, 'JWT_SECRET', settings.SECRET_KEY)
            payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'detail': 'Token expired!'}, status=401)
        except jwt.InvalidTokenError:
            return Response({'detail': 'Invalid token!'}, status=401)

        user = User.objects.filter(id=payload['id']).first()
        
        if not user:
            return Response({'detail': 'User not found!'}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class VerifyEmailView(APIView):
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({
                'error': 'Verification token is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.filter(verification_token=token).first()
            
            if not user:
                return Response({
                    'error': 'Invalid verification token.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if token is expired
            if not user.is_token_valid():
                return Response({
                    'error': 'Verification token has expired. Please request a new verification email.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify the user
            user.is_verified = True
            user.is_active = True
            user.verification_token = None
            user.token_expires_at = None
            user.save()
            
            return Response({
                'message': 'Email verified successfully! You can now log in.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'is_verified': user.is_verified
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'An error occurred during verification: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ResendVerificationEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Email is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.filter(email=email).first()
            
            if not user:
                return Response({
                    'error': 'User with this email does not exist.'
                }, status=status.HTTP_404_NOT_FOUND)
            
            if user.is_verified:
                return Response({
                    'message': 'Email is already verified.'
                }, status=status.HTTP_200_OK)
            
            # Generate new verification token
            verification_token = user.generate_verification_token()
            
            # Send verification email
            email_sent = send_verification_email(user, verification_token)
            
            if email_sent:
                return Response({
                    'message': 'Verification email has been sent. Please check your inbox.'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send verification email. Please try again later.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
