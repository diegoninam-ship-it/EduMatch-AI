from django.contrib.auth import authenticate
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import serializers

MAX_ATTEMPTS = 5
BLOCK_MINUTES = 15
BLOCK_SECONDS = 20  # pruebas — cambiar a BLOCK_MINUTES * 60 en producción


def _send_block_email(user):
    """Envía correo al usuario notificando el bloqueo de su cuenta."""
    try:
        send_mail(
            subject='Tu cuenta ha sido bloqueada temporalmente — EduMatch AI',
            message=f'''
Hola {user.first_name},

Detectamos {MAX_ATTEMPTS} intentos fallidos de inicio de sesión en tu cuenta.

Por seguridad, tu cuenta ha sido bloqueada temporalmente por {BLOCK_MINUTES} minutos.

Si fuiste tú quien intentó ingresar, espera {BLOCK_MINUTES} minutos e intenta de nuevo.
Si no fuiste tú, te recomendamos recuperar tu contraseña:
http://localhost:5173/forgot-password

EduMatch AI — Equipo de Seguridad
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
    except Exception:
        pass


class LoginSerializer(serializers.Serializer):

    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from apps.users.models import User

        email = attrs.get('correo')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'mensaje': 'Credenciales inválidas',
                'intentos_restantes': None,
                'bloqueado': False,
            })

        # Verificar si está bloqueado
        if user.blocked_until and timezone.now() < user.blocked_until:
            remaining_seconds = int((user.blocked_until - timezone.now()).total_seconds())
            remaining_minutes = max(1, remaining_seconds // 60)
            raise serializers.ValidationError({
                'mensaje': f'Cuenta bloqueada. Intenta en {remaining_minutes} minuto(s).',
                'intentos_restantes': 0,
                'bloqueado': True,
                'segundos_restantes': remaining_seconds,
            })

        # Autenticar
        auth_user = authenticate(username=email, password=password)

        if not auth_user:
            user.login_attempts += 1

            if user.login_attempts >= MAX_ATTEMPTS:
                user.blocked_until = timezone.now() + timezone.timedelta(seconds=BLOCK_SECONDS)
                user.login_attempts = 0
                user.save(update_fields=['login_attempts', 'blocked_until'])
                _send_block_email(user)
                raise serializers.ValidationError({
                    'mensaje': f'Cuenta bloqueada por {BLOCK_SECONDS} segundos tras {MAX_ATTEMPTS} intentos fallidos.',
                    'intentos_restantes': 0,
                    'bloqueado': True,
                    'segundos_restantes': BLOCK_SECONDS,
                })

            user.save(update_fields=['login_attempts'])
            restantes = MAX_ATTEMPTS - user.login_attempts
            raise serializers.ValidationError({
                'mensaje': f'Contraseña incorrecta.',
                'intentos_restantes': restantes,
                'bloqueado': False,
            })

        if not auth_user.is_active:
            raise serializers.ValidationError({
                'mensaje': 'Usuario suspendido. Contacta al administrador.',
                'intentos_restantes': None,
                'bloqueado': False,
            })

        # Login exitoso — resetear intentos
        auth_user.login_attempts = 0
        auth_user.blocked_until = None
        auth_user.save(update_fields=['login_attempts', 'blocked_until'])

        attrs['user'] = auth_user
        return attrs
