from django.db import models
from apps.core.models import Tenant

class MessageLog(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="message_logs")
    to_phone = models.CharField(max_length=30)
    template = models.CharField(max_length=50)  # CONFIRMATION | REMINDER
    payload = models.JSONField(default=dict)
    status = models.CharField(max_length=20, default="SENT")  # SENT | ERROR
    created_at = models.DateTimeField(auto_now_add=True)