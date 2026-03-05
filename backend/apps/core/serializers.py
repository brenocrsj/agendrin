from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ("id", "name", "slug", "phone", "primary_color", "secondary_color", "trial_ends_at", "subscription_status")
        read_only_fields = ("id", "trial_ends_at", "subscription_status")