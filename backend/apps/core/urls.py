from django.urls import path
from .views import TenantMeView

urlpatterns = [
    path("tenant/me/", TenantMeView.as_view()),
]