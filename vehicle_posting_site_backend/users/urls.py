
from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, VerifyEmailView, ResendVerificationEmailView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('verify-email', VerifyEmailView.as_view()),
    path('resend-verification', ResendVerificationEmailView.as_view()),
]
# localhost:8000/api/auth/register
# localhost:8000/api/auth/verify-email
# localhost:8000/api/auth/resend-verification