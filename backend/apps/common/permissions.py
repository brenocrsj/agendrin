from rest_framework.permissions import BasePermission

class IsTenantUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "tenant_id", None))