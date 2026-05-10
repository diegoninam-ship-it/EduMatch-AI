from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.users.models import User
from apps.users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = User.objects.select_related('role').all()

    serializer_class = UserSerializer

    