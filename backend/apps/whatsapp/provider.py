"""
Provedor de WhatsApp (stub).
Depois trocamos por Twilio/Infobip/etc.
"""
from .models import MessageLog

def send_template_message(*, tenant, to_phone: str, template: str, payload: dict) -> None:
    # aqui você chamaria API oficial.
    MessageLog.objects.create(
        tenant=tenant,
        to_phone=to_phone,
        template=template,
        payload=payload,
        status="SENT",
    )