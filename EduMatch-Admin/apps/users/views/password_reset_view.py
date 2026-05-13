from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from apps.users.models import User
from apps.users.models.password_reset_token import PasswordResetToken


@extend_schema(tags=['Authentication'])
class ForgotPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        correo = request.data.get('correo')
        if not correo:
            return Response(
                {'error': 'El correo es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=correo)
        except User.DoesNotExist:
            # Por seguridad, no revelar si el correo existe
            return Response(
                {'message': 'Si el correo existe, recibirás un enlace de recuperación.'},
                status=status.HTTP_200_OK
            )

        # Invalidar tokens anteriores
        PasswordResetToken.objects.filter(user=user, used=False).update(used=True)

        # Crear nuevo token
        token_obj = PasswordResetToken.objects.create(user=user)

        reset_link = f"http://localhost:5173/reset-password?token={token_obj.token}"

        send_mail(
            subject='Recupera tu contraseña — EduMatch AI',
            message=f'''
Hola {user.first_name},

Recibiste este correo porque solicitaste recuperar tu contraseña.

Haz clic en el siguiente enlace (válido por 30 minutos):
{reset_link}

Si no solicitaste esto, ignora este correo.

EduMatch AI
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {'message': 'Si el correo existe, recibirás un enlace de recuperación.'},
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['Authentication'])
class ResetPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')
        confirm_password = request.data.get('password_confirm')

        if not token or not new_password or not confirm_password:
            return Response(
                {'error': 'Token y contraseñas son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {'error': 'Las contraseñas no coinciden'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {'error': 'La contraseña debe tener al menos 8 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token_obj = PasswordResetToken.objects.select_related('user').get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {'error': 'Token inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not token_obj.is_valid():
            return Response(
                {'error': 'El enlace ha expirado. Solicita uno nuevo.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = token_obj.user
        user.set_password(new_password)
        user.login_attempts = 0
        user.blocked_until = None
        user.save()

        token_obj.used = True
        token_obj.save()

        return Response(
            {'message': 'Contraseña actualizada correctamente'},
            status=status.HTTP_200_OK
        )
