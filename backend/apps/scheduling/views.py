from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime, time, timedelta

from apps.common.permissions import IsTenantUser
from apps.core.models import Tenant
from .models import Service, Professional, Customer, Appointment, TimeBlock
from .serializers import (
    ServiceSerializer, ProfessionalSerializer, CustomerSerializer,
    AppointmentSerializer, PublicCreateAppointmentSerializer, TimeBlockSerializer
)

class TenantScopedViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTenantUser]

    def get_queryset(self):
        return self.queryset.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class ServiceViewSet(TenantScopedViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ProfessionalViewSet(TenantScopedViewSet):
    queryset = Professional.objects.all()
    serializer_class = ProfessionalSerializer

class CustomerViewSet(TenantScopedViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTenantUser]
    queryset = Appointment.objects.select_related("service", "professional", "customer").all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        qs = super().get_queryset().filter(tenant=self.request.user.tenant)
        date_from = self.request.query_params.get("from")
        date_to = self.request.query_params.get("to")
        if date_from and date_to:
            qs = qs.filter(starts_at__gte=date_from, starts_at__lte=date_to)
        return qs.order_by("starts_at")

class TimeBlockViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTenantUser]
    queryset = TimeBlock.objects.select_related("professional").all()
    serializer_class = TimeBlockSerializer

    def get_queryset(self):
        qs = super().get_queryset().filter(tenant=self.request.user.tenant)
        date_from = self.request.query_params.get("from")
        date_to = self.request.query_params.get("to")
        if date_from and date_to:
            qs = qs.filter(starts_at__gte=date_from, starts_at__lte=date_to)
        return qs.order_by("starts_at")

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_catalog(request, slug):
    tenant = get_object_or_404(Tenant, slug=slug)

    services = Service.objects.filter(tenant=tenant, is_active=True).order_by("name")
    professionals = Professional.objects.filter(tenant=tenant, is_active=True).order_by("name")

    return Response({
        "tenant": {
            "name": tenant.name,
            "slug": tenant.slug,
            "primary_color": tenant.primary_color,
            "secondary_color": tenant.secondary_color,
            "phone": tenant.phone,
        },
        "services": ServiceSerializer(services, many=True).data,
        "professionals": ProfessionalSerializer(professionals, many=True).data,
    })

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def public_availability(request, slug):
    tenant = get_object_or_404(Tenant, slug=slug)

    service_id = request.query_params.get("serviceId")
    professional_id = request.query_params.get("professionalId")
    day = request.query_params.get("date")  # YYYY-MM-DD

    service = get_object_or_404(Service, id=service_id, tenant=tenant, is_active=True)
    professional = get_object_or_404(Professional, id=professional_id, tenant=tenant, is_active=True)

    d = parse_date(day)
    if not d:
        return Response({"detail": "date inválida (use YYYY-MM-DD)."}, status=400)

    start_dt = timezone.make_aware(datetime.combine(d, time(8, 0)))
    end_dt = timezone.make_aware(datetime.combine(d, time(20, 0)))

    duration = timedelta(minutes=service.duration_min)

    slots = []
    cursor = start_dt
    while cursor + duration <= end_dt:
        slot_end = cursor + duration

        conflict_appt = Appointment.objects.filter(
            professional=professional,
            status__in=["PENDING", "CONFIRMED"],
            starts_at__lt=slot_end,
            ends_at__gt=cursor,
        ).exists()

        conflict_block = TimeBlock.objects.filter(
            professional=professional,
            starts_at__lt=slot_end,
            ends_at__gt=cursor,
        ).exists()

        if not conflict_appt and not conflict_block and cursor >= timezone.now():
            slots.append(cursor.isoformat())

        cursor += timedelta(minutes=30)

    return Response({"slots": slots})

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def public_create_appointment(request, slug):
    tenant = get_object_or_404(Tenant, slug=slug)
    ser = PublicCreateAppointmentSerializer(data=request.data, context={"tenant": tenant})
    ser.is_valid(raise_exception=True)
    appt = ser.save()
    return Response({"id": appt.id, "status": appt.status})