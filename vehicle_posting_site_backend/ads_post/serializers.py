# ads_post/serializers.py
from rest_framework import serializers
from .models import Vehicle, VehicleCategory, VehicleImage
from django.conf import settings

class VehicleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleCategory
        fields = ('id', 'name')

class VehicleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = VehicleImage
        fields = ('id', 'image', 'image_url', 'is_primary', 'uploaded_at')
        read_only_fields = ('id', 'uploaded_at', 'image_url')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

class VehicleSerializer(serializers.ModelSerializer):
    posted_by = serializers.ReadOnlyField(source='posted_by.id')
    images = VehicleImageSerializer(many=True, read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=VehicleCategory.objects.all(), required=False, allow_null=True)
    primary_image = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'posted_by', 'category', 'manufacturer', 'model', 'city', 'plate_number',
            'year', 'vehicle_type', 'engine_capacity', 'transmission', 'fuel_type',
            'mileage', 'price', 'images', 'primary_image', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'posted_by', 'created_at', 'updated_at', 'images', 'primary_image')

    def get_primary_image(self, obj):
        primary_img = obj.images.filter(is_primary=True).first()
        if not primary_img:
            primary_img = obj.images.first()
        
        if primary_img:
            serializer = VehicleImageSerializer(primary_img, context=self.context)
            return serializer.data
        return None
