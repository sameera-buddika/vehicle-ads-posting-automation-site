# ads_post/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import get_object_or_404
from .models import Vehicle, VehicleCategory
from .serializers import VehicleSerializer, VehicleCategorySerializer
import jwt
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser

JWT_SECRET = getattr(settings, 'JWT_SECRET', settings.SECRET_KEY)

def get_user_id_from_request(request):
    token = request.COOKIES.get('jwt')
    if not token:
        raise AuthenticationFailed('Unauthenticated!')
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated!')
    return payload['id']


class VehicleCategoryView(APIView):
    def get(self, request):
        cats = VehicleCategory.objects.all()
        serializer = VehicleCategorySerializer(cats, many=True)
        return Response(serializer.data)


class VehicleListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # to allow file uploads

    def get(self, request):
        # Optional public listing: allow unauthenticated GET by removing the auth check below
        # Here we require auth (same pattern as user endpoints)
        _ = get_user_id_from_request(request)

        mine = request.query_params.get('mine', 'false').lower() == 'true'
        if mine:
            user_id = get_user_id_from_request(request)
            qs = Vehicle.objects.filter(posted_by_id=user_id).order_by('-created_at')
        else:
            qs = Vehicle.objects.all().order_by('-created_at')

        serializer = VehicleSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        user_id = get_user_id_from_request(request)
        data = request.data.copy()
        data['posted_by'] = user_id

        serializer = VehicleSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VehicleDetailView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, ad_id):
        _ = get_user_id_from_request(request)
        vehicle = get_object_or_404(Vehicle, id=ad_id)
        serializer = VehicleSerializer(vehicle, context={'request': request})
        return Response(serializer.data)

    def put(self, request, ad_id):
        user_id = get_user_id_from_request(request)
        vehicle = get_object_or_404(Vehicle, id=ad_id)
        if vehicle.posted_by_id != user_id:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['posted_by'] = vehicle.posted_by_id  # prevent change of owner

        serializer = VehicleSerializer(vehicle, data=data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, ad_id):
        user_id = get_user_id_from_request(request)
        vehicle = get_object_or_404(Vehicle, id=ad_id)
        if vehicle.posted_by_id != user_id:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
