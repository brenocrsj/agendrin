from django.db import models
from apps.core.models import Tenant

class Service(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=120)
    duration_min = models.PositiveIntegerField(default=30)
    price_cents = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

class Professional(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="professionals")
    name = models.CharField(max_length=120)
    is_active = models.BooleanField(default=True)

class Customer(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="customers")
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)

    class Meta:
        indexes = [models.Index(fields=["tenant", "phone"])]

class Appointment(models.Model):
    STATUS = (
        ("PENDING", "Pendente"),
        ("CONFIRMED", "Confirmado"),
        ("COMPLETED", "Concluído"),
        ("NO_SHOW", "Ausente"),
        ("CANCELED", "Cancelado"),
    )
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="appointments")
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    professional = models.ForeignKey(Professional, on_delete=models.PROTECT)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS, default="PENDING")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["tenant", "starts_at"]),
            models.Index(fields=["professional", "starts_at"]),
        ]