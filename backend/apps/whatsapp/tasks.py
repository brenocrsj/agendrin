from celery import shared_task
from django.utils import timezone
from datetime import timedelta

from apps.scheduling.models import Appointment
from .provider import send_template_message

def enqueue_confirmation_and_reminder(appointment_id: int):
    send_confirmation.delay(appointment_id)

    # agenda lembrete 2h antes
    try:
        appt = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return
    eta = appt.starts_at - timedelta(hours=2)
    if eta > timezone.now():
        send_reminder.apply_async(args=[appointment_id], eta=eta)

@shared_task
def send_confirmation(appointment_id: int):
    appt = Appointment.objects.select_related("tenant", "customer", "service", "professional").get(id=appointment_id)
    send_template_message(
        tenant=appt.tenant,
        to_phone=appt.customer.phone,
        template="CONFIRMATION",
        payload={
            "service": appt.service.name,
            "professional": appt.professional.name,
            "starts_at": appt.starts_at.isoformat(),
        }
    )

@shared_task
def send_reminder(appointment_id: int):
    appt = Appointment.objects.select_related("tenant", "customer", "service", "professional").get(id=appointment_id)
    send_template_message(
        tenant=appt.tenant,
        to_phone=appt.customer.phone,
        template="REMINDER_2H",
        payload={
            "service": appt.service.name,
            "professional": appt.professional.name,
            "starts_at": appt.starts_at.isoformat(),
        }
    )