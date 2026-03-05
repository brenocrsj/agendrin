from rest_framework import generics
from apps.common.permissions import IsTenantUser
from .serializers import TenantSerializer

class TenantMeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsTenantUser]
    serializer_class = TenantSerializer

    def get_object(self):
        return self.request.user.tenant