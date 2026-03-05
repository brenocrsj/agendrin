from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, ProfessionalViewSet, CustomerViewSet,
    AppointmentViewSet, TimeBlockViewSet,
    public_catalog, public_availability, public_create_appointment,
)

router = DefaultRouter()
router.register("services", ServiceViewSet, basename="services")
router.register("professionals", ProfessionalViewSet, basename="professionals")
router.register("customers", CustomerViewSet, basename="customers")
router.register("appointments", AppointmentViewSet, basename="appointments")
router.register("timeblocks", TimeBlockViewSet, basename="timeblocks")

urlpatterns = [
    path("", include(router.urls)),
    path("public/<slug:slug>/catalog/", public_catalog),
    path("public/<slug:slug>/availability/", public_availability),
    path("public/<slug:slug>/appointments/", public_create_appointment),
]