from rest_framework import viewsets

from apps.ai_routes.models import StudentProgress

from apps.ai_routes.serializers import (
    StudentProgressSerializer
)

from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['AI Routes']
)
class StudentProgressViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = StudentProgress.objects.select_related(
        'student',
        'topic'
    ).all()

    serializer_class = StudentProgressSerializer