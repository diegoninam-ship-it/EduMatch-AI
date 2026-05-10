from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsAdminUserRole


class MeView(APIView):

    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):

        user = request.user

        return Response({

            'id': str(user.id),

            'email': user.email,

            'first_name': user.first_name,

            'last_name': user.last_name,

            'role': user.role.name,
        })