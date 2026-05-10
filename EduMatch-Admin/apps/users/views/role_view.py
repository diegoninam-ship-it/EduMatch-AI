from rest_framework import viewsets

from apps.users.models import Role
from apps.users.serializers import RoleSerializer


class RoleViewSet(viewsets.ModelViewSet):

    queryset = Role.objects.all()

    serializer_class = RoleSerializer