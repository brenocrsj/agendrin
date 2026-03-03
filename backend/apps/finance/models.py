from django.db import models
from apps.core.models import Tenant

class Transaction(models.Model):
    TYPE = (("IN", "Entrada"), ("OUT", "Saída"))
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="transactions")
    type = models.CharField(max_length=10, choices=TYPE)
    amount_cents = models.PositiveIntegerField()
    description = models.CharField(max_length=255)
    occurred_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)