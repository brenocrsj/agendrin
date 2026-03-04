from django.db import models
from django.utils import timezone
from datetime import timedelta

class Tenant(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    phone = models.CharField(max_length=30, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    # Pode começar vazio; o save() abaixo preenche automaticamente.
    trial_ends_at = models.DateTimeField(null=True, blank=True)

    subscription_status = models.CharField(max_length=20, default="TRIAL")  # TRIAL | ACTIVE | PAST_DUE | CANCELED

    primary_color = models.CharField(max_length=20, default="#FFFFFF")  # branco
    secondary_color = models.CharField(max_length=20, default="#7EC8FF")  # azul claro (ajustável)

    def save(self, *args, **kwargs):
        if not self.trial_ends_at:
            self.trial_ends_at = timezone.now() + timedelta(days=15)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name