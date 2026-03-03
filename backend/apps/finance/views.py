from rest_framework import viewsets
from apps.common.permissions import IsTenantUser
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTenantUser]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.filter(tenant=self.request.user.tenant).order_by("-occurred_at")
        f = self.request.query_params.get("from")
        t = self.request.query_params.get("to")
        if f and t:
            qs = qs.filter(occurred_at__gte=f, occurred_at__lte=t)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)