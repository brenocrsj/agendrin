from django.utils import timezone
from django.http import JsonResponse
from django.urls import resolve

PUBLIC_PREFIXES = (
    "api/auth/",
    "admin/",
)

ALLOW_WHEN_EXPIRED = (
    "api/auth/login",
    "api/auth/me",
)

class SubscriptionGateMiddleware:
    """
    Bloqueia uso do sistema quando trial expira e assinatura não está ativa.
    Regra: se tenant.subscription_status != ACTIVE e trialEndsAt < now => bloqueia (exceto login/me).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path.lstrip("/")

        # rotas públicas
        if path.startswith(PUBLIC_PREFIXES):
            return self.get_response(request)

        # endpoints públicos de agendamento
        if path.startswith("api/scheduling/public/"):
            return self.get_response(request)

        # se não estiver autenticado, deixa o DRF lidar
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return self.get_response(request)

        # exceções
        if any(path.startswith(p) for p in ALLOW_WHEN_EXPIRED):
            return self.get_response(request)

        tenant = getattr(user, "tenant", None)
        if not tenant:
            return self.get_response(request)

        now = timezone.now()
        expired = tenant.trial_ends_at and tenant.trial_ends_at < now
        if expired and tenant.subscription_status != "ACTIVE":
            return JsonResponse(
                {"detail": "Seu teste grátis expirou. Ative a assinatura para continuar."},
                status=402
            )

        return self.get_response(request)