from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import LoginSerializer


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