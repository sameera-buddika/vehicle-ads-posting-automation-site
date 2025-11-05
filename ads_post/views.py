from django.shortcuts import render
from .models import VehicleCategory
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated as is_authenticated

# Create your views here.
class VehicleCategoryView(APIView):
    def get(self, request):
        categories = VehicleCategory.objects.all()
        data = [{'id': category.id, 'name': category.name} for category in categories]
        return render(request, 'vehicle_categories.html', {'categories': data})
    

class AdsPostView(APIView):
    permission_classes = (is_authenticated,)
    
    def post(self, request):
        # Logic for posting a vehicle ad
        pass

    def get(self, request):
        # Logic for retrieving vehicle ads
        pass

    def put(self, request, ad_id):
        # Logic for updating a vehicle ad
        pass

