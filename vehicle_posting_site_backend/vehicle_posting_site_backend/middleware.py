"""
Custom middleware to exempt API routes from CSRF protection
"""
from django.utils.deprecation import MiddlewareMixin


class DisableCSRFForAPI(MiddlewareMixin):
    """
    Middleware to disable CSRF protection for all API endpoints.
    Since we're using JWT authentication (not session-based), CSRF is not needed.
    """
    
    def process_request(self, request):
        # Exempt all /api/ routes from CSRF
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None

