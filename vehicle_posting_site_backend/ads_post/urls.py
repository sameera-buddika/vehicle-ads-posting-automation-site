# ads_post/urls.py
from django.urls import path
from .views import VehicleListCreateView, VehicleDetailView, VehicleCategoryView, VehicleImageDeleteView
from .verification_views import (
    VerifyVehicleView,
    VerificationStatusView,
    VerificationResultDetailView,
    VehicleVerificationHistoryView,
    RetryVerificationView,
    BulkVerificationView
)

urlpatterns = [
    # Vehicle endpoints
    path('categories/', VehicleCategoryView.as_view(), name='vehicle-categories'),
    path('', VehicleListCreateView.as_view(), name='vehicles-list-create'),
    path('<int:ad_id>/', VehicleDetailView.as_view(), name='vehicles-detail'),
    path('images/<int:image_id>/', VehicleImageDeleteView.as_view(), name='vehicle-image-delete'),
    
    # Verification endpoints
    path('<int:vehicle_id>/verify/', VerifyVehicleView.as_view(), name='vehicle-verify'),
    path('<int:vehicle_id>/verification-status/', VerificationStatusView.as_view(), name='vehicle-verification-status'),
    path('<int:vehicle_id>/verification-history/', VehicleVerificationHistoryView.as_view(), name='vehicle-verification-history'),
    path('<int:vehicle_id>/retry-verification/', RetryVerificationView.as_view(), name='vehicle-retry-verification'),
    path('bulk-verify/', BulkVerificationView.as_view(), name='bulk-verification'),
    path('verification-results/<int:result_id>/', VerificationResultDetailView.as_view(), name='verification-result-detail'),
]
