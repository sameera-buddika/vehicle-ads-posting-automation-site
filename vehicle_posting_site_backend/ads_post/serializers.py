# ads_post/serializers.py
from rest_framework import serializers
from .models import Vehicle, VehicleCategory
from django.conf import settings

class VehicleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleCategory
        fields = ('id', 'name')

class VehicleSerializer(serializers.ModelSerializer):
    posted_by = serializers.ReadOnlyField(source='posted_by.id')
    image_url = serializers.SerializerMethodField(read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=VehicleCategory.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'posted_by', 'category', 'manufacturer', 'model', 'city', 'plate_number',
            'year', 'vehicle_type', 'engine_capacity', 'transmission', 'fuel_type',
            'mileage', 'price', 'image', 'image_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'posted_by', 'created_at', 'updated_at', 'image_url')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None
