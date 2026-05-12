from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from apps.users.serializers.register_serializer import RegisterSerializer
from apps.users.serializers.login_response_serializer import (
    LoginResponseSerializer
)


@extend_schema(
    tags=['Authentication'],
    request=RegisterSerializer,
    responses={
        201: LoginResponseSerializer,
        400: {
            'type': 'object',
            'properties': {
                'error': {'type': 'string'}
            }
        }
    }
)
class RegisterView(APIView):
    """
    Vista para el registro de nuevos usuarios
    """
    permission_classes = []

    def post(self, request):
        """
        Registrar un nuevo usuario
        """
        serializer = RegisterSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()

        # Generar tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': {
                    'id': str(user.role.id),
                    'name': user.role.name
                }
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)
