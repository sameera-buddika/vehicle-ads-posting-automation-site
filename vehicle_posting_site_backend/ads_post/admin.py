from django.contrib import admin
from .models import VehicleCategory, Vehicle, VehicleImage

class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('manufacturer', 'model', 'year', 'posted_by', 'price', 'created_at')
    list_filter = ('vehicle_type', 'transmission', 'fuel_type', 'year')
    search_fields = ('manufacturer', 'model', 'city')
    inlines = [VehicleImageInline]

@admin.register(VehicleImage)
class VehicleImageAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'is_primary', 'uploaded_at')
    list_filter = ('is_primary',)

admin.site.register(VehicleCategory)
