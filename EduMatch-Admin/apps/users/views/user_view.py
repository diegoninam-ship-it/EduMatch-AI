from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.users.models import User
from apps.users.serializers import UserSerializer

from apps.users.permissions import IsAdminUserRole

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUserRole]

    queryset = User.objects.select_related('role').all()

    serializer_class = UserSerializer

    