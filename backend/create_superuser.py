import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agendrin_api.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

EMAIL = "admin@agendrin.com"
PASSWORD = "12345678"
DEFAULT_USERNAME = "admin"

def main():
    try:
        username_field = getattr(User, "USERNAME_FIELD", "username")

        # Monta filtros/kwargs conforme o modelo real
        lookup = {}
        create_kwargs = {}

        if username_field == "email":
            lookup["email"] = EMAIL
            create_kwargs["email"] = EMAIL
        else:
            # ex.: username_field == "username"
            lookup[username_field] = DEFAULT_USERNAME
            create_kwargs[username_field] = DEFAULT_USERNAME

            # Se existir campo email, preenche também
            if any(f.name == "email" for f in User._meta.fields):
                create_kwargs["email"] = EMAIL

        user = User.objects.filter(**lookup).first()
        if user:
            print("Super usuário já existe. Garantindo senha/permissões...")
        else:
            print("Criando super usuário padrão...")
            # Alguns managers exigem args específicos; vamos criar e garantir flags
            user = User.objects.create(**create_kwargs)

        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.set_password(PASSWORD)
        user.save()

        print("OK: super usuário pronto.")
        return 0

    except Exception as e:
        # NÃO derruba o container
        print("ERRO ao criar super usuário (mas a API vai subir mesmo):", repr(e))
        return 0

if __name__ == "__main__":
    sys.exit(main())