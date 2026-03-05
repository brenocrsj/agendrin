from django.http import JsonResponse
from django.urls import path, include
from django.contrib import admin

def home(request):
    return JsonResponse({
        "app": "Agendrin",
        "status": "ok",
        "admin": "/admin/",
        "docs": {
            "auth": "/api/auth/",
            "scheduling": "/api/scheduling/",
            "finance": "/api/finance/",
            "whatsapp": "/api/whatsapp/",
        }
    })

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/scheduling/", include("apps.scheduling.urls")),
    path("api/finance/", include("apps.finance.urls")),
    path("api/whatsapp/", include("apps.whatsapp.urls")),
    path("api/core/", include("apps.core.urls")),
]