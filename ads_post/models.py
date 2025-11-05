from django.db import models

class VehicleCategory(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
class VehicleImages(models.Model):
    post = models.ForeignKey('UserVehiclePost', on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    def __str__(self):
        return self.image_url
        
class UserVehiclePost(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    manifacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    model_year = models.IntegerField()
    register_year =models.IntegerField()
    category = models.ForeignKey(VehicleCategory, on_delete=models.SET_NULL, null=True)
    engine_capacity=models.IntegerField()
    mileage = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
