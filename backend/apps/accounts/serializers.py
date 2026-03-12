from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from apps.core.models import Tenant

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        data["email"] = self.user.email
        return data

class RegisterSerializer(serializers.Serializer):
    tenant_name = serializers.CharField(max_length=120)
    tenant_slug = serializers.SlugField()
    owner_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)

    def validate_tenant_slug(self, value):
        if Tenant.objects.filter(slug=value).exists():
            raise serializers.ValidationError("Este slug já está em uso.")
        return value

    def create(self, validated_data):
        tenant = Tenant.objects.create(
            name=validated_data["tenant_name"],
            slug=validated_data["tenant_slug"],
        )
        user = User.objects.create(
            username=validated_data["email"],  # simples
            email=validated_data["email"],
            first_name=validated_data["owner_name"],
            tenant=tenant,
            password=make_password(validated_data["password"]),
            is_staff=True,
            is_superuser=False,
        )
        return user

class MeSerializer(serializers.ModelSerializer):
    tenant = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "tenant")

    def get_tenant(self, obj):
        t = obj.tenant
        if not t:
            return None
        return {
            "id": t.id,
            "name": t.name,
            "slug": t.slug,
            "trial_ends_at": t.trial_ends_at,
            "subscription_status": t.subscription_status,
            "primary_color": t.primary_color,
            "secondary_color": t.secondary_color,
        }