from rest_framework.views import APIView
from rest_framework.response import Response
from apps.common.permissions import IsTenantUser
from .models import MessageLog

class MessageLogView(APIView):
    permission_classes = [IsTenantUser]

    def get(self, request):
        logs = MessageLog.objects.filter(tenant=request.user.tenant).order_by("-created_at")[:50]
        return Response([{
            "to_phone": l.to_phone,
            "template": l.template,
            "payload": l.payload,
            "status": l.status,
            "created_at": l.created_at,
        } for l in logs])