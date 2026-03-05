import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agendrin_api.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

EMAIL = "admin@agendrin.com"
PASSWORD = "12345678"

def main():
    try:
        # Seu backend autentica com username=email, então o username precisa ser o email
        username_value = EMAIL

        user = User.objects.filter(username=username_value).first()

        if user:
            print("Super usuário já existe. Atualizando senha/permissões...")
        else:
            print("Criando super usuário padrão...")
            user = User.objects.create(username=username_value, email=EMAIL)

        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.set_password(PASSWORD)
        user.save()

        print("OK: super usuário pronto.")
        return 0

    except Exception as e:
        print("ERRO ao criar super usuário (mas a API vai subir mesmo):", repr(e))
        return 0

if __name__ == "__main__":
    sys.exit(main())