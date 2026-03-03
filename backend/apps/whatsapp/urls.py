from django.urls import path
from .views import MessageLogView

urlpatterns = [
    path("logs/", MessageLogView.as_view()),
]