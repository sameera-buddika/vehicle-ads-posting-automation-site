# ads_post/urls.py
from django.urls import path
from .views import VehicleListCreateView, VehicleDetailView, VehicleCategoryView

urlpatterns = [
    path('categories/', VehicleCategoryView.as_view(), name='vehicle-categories'),
    path('', VehicleListCreateView.as_view(), name='vehicles-list-create'),
    path('<int:ad_id>/', VehicleDetailView.as_view(), name='vehicles-detail'),
]
