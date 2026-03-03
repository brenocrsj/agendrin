from django.db import models
from django.contrib.auth.models import AbstractUser
from apps.core.models import Tenant

class User(AbstractUser):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
    # username/email: vamos usar email como login (username continua existindo internamente)