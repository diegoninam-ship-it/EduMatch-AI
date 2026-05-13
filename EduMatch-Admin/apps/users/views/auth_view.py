from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from apps.users.serializers import LoginSerializer

from drf_spectacular.utils import extend_schema

from apps.users.serializers.login_response_serializer import (
    LoginResponseSerializer
)

@extend_schema(
    tags=['Authentication'],
    request=LoginSerializer,
    responses={
        200: LoginResponseSerializer
    }
    
)
class LoginView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

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

        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """Invalida el refresh token en el servidor (blacklist)"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'Refresh token requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Sesión cerrada correctamente.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'detail': 'Token inválido o ya expirado.'}, status=status.HTTP_400_BAD_REQUEST)