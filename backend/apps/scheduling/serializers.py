from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from .models import Service, Professional, Customer, Appointment
from apps.whatsapp.tasks import enqueue_confirmation_and_reminder

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ("tenant",)

class ProfessionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professional
        fields = "__all__"
        read_only_fields = ("tenant",)

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = ("tenant",)

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("tenant", "ends_at")

    def validate(self, attrs):
        starts_at = attrs.get("starts_at")
        service = attrs.get("service")
        professional = attrs.get("professional")

        if starts_at and starts_at < timezone.now():
            raise serializers.ValidationError("Não é possível agendar no passado.")

        if service and starts_at:
            attrs["ends_at"] = starts_at + timedelta(minutes=service.duration_min)

        # valida tenant em objetos
        user = self.context["request"].user
        tenant = user.tenant
        for obj_field in ("service", "professional", "customer"):
            obj = attrs.get(obj_field)
            if obj and obj.tenant_id != tenant.id:
                raise serializers.ValidationError(f"{obj_field} não pertence ao seu estabelecimento.")

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        tenant = request.user.tenant
        validated_data["tenant"] = tenant

        # Anti-conflito (sobreposição)
        with transaction.atomic():
            professional = validated_data["professional"]
            starts_at = validated_data["starts_at"]
            ends_at = validated_data["ends_at"]

            conflict = Appointment.objects.select_for_update().filter(
                professional=professional,
                status__in=["PENDING", "CONFIRMED"],
                starts_at__lt=ends_at,
                ends_at__gt=starts_at,
            ).exists()

            if conflict:
                raise serializers.ValidationError("Conflito: profissional já tem um agendamento neste horário.")

            appt = Appointment.objects.create(**validated_data)

        # enfileira confirmação e lembrete
        enqueue_confirmation_and_reminder(appt.id)

        return appt

class PublicCreateAppointmentSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    professional_id = serializers.IntegerField()
    starts_at = serializers.DateTimeField()
    customer_name = serializers.CharField(max_length=120)
    customer_phone = serializers.CharField(max_length=30)

    def create(self, validated_data):
        tenant = self.context["tenant"]

        service = Service.objects.get(id=validated_data["service_id"], tenant=tenant, is_active=True)
        professional = Professional.objects.get(id=validated_data["professional_id"], tenant=tenant, is_active=True)

        customer, _ = Customer.objects.get_or_create(
            tenant=tenant,
            phone=validated_data["customer_phone"],
            defaults={"name": validated_data["customer_name"]},
        )
        if customer.name != validated_data["customer_name"]:
            customer.name = validated_data["customer_name"]
            customer.save(update_fields=["name"])

        starts_at = validated_data["starts_at"]
        ends_at = starts_at + timedelta(minutes=service.duration_min)

        with transaction.atomic():
            conflict = Appointment.objects.select_for_update().filter(
                professional=professional,
                status__in=["PENDING", "CONFIRMED"],
                starts_at__lt=ends_at,
                ends_at__gt=starts_at,
            ).exists()
            if conflict:
                raise serializers.ValidationError("Horário indisponível.")

            appt = Appointment.objects.create(
                tenant=tenant,
                service=service,
                professional=professional,
                customer=customer,
                starts_at=starts_at,
                ends_at=ends_at,
                status="CONFIRMED",
            )

        enqueue_confirmation_and_reminder(appt.id)
        return appt