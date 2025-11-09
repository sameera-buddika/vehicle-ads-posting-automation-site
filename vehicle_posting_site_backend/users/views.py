from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import UserSerializer
from .models import User
import jwt, datetime


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

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
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
