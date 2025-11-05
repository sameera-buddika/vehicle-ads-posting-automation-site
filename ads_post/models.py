# ads_post/models.py
from django.db import models
from django.conf import settings

class VehicleCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vehicles')
    category = models.ForeignKey(VehicleCategory, on_delete=models.SET_NULL, null=True, blank=True)
    manufacturer = models.CharField(max_length=120)
    model = models.CharField(max_length=120)
    city = models.CharField(max_length=120, blank=True, null=True)
    plate_number = models.CharField(max_length=50, blank=True, null=True)
    year = models.PositiveSmallIntegerField(blank=True, null=True)
    vehicle_type = models.CharField(max_length=80, blank=True, null=True)
    engine_capacity = models.CharField(max_length=50, blank=True, null=True)
    transmission = models.CharField(max_length=50, blank=True, null=True)
    fuel_type = models.CharField(max_length=50, blank=True, null=True)
    mileage = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.manufacturer} {self.model}"
