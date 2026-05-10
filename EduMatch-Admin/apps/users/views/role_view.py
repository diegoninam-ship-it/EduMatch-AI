from rest_framework import viewsets

from apps.users.models import Role
from apps.users.serializers import RoleSerializer

from apps.users.permissions import IsAdminUserRole


class RoleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUserRole]

    queryset = Role.objects.all()

    serializer_class = RoleSerializer