import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Cria um superusuário inicial se ele ainda não existir."

    def handle(self, *args, **options):
        User = get_user_model()

        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")
        username = os.getenv("ADMIN_USERNAME", "admin")

        if not email or not password:
            self.stdout.write(
                self.style.WARNING("ADMIN_EMAIL ou ADMIN_PASSWORD não definidos. Pulando criação do admin.")
            )
            return

        existing_user = User.objects.filter(email=email).first()
        if existing_user:
            self.stdout.write(
                self.style.SUCCESS(f"Admin já existe: {email}")
            )
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )

        self.stdout.write(
            self.style.SUCCESS(f"Superusuário criado com sucesso: {email}")
        )