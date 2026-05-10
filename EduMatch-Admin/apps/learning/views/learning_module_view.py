from rest_framework import viewsets

from apps.learning.models import LearningModule
from apps.learning.serializers import LearningModuleSerializer

from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['Learning']
)
class LearningModuleViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = LearningModule.objects.select_related(
        'subject'
    ).all()

    serializer_class = LearningModuleSerializer