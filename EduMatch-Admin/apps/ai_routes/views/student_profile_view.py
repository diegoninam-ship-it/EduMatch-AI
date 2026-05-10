from rest_framework import viewsets

from apps.ai_routes.models import StudentProfile

from apps.ai_routes.serializers import (
    StudentProfileSerializer
)

from apps.users.permissions import IsAdminUserRole


class StudentProfileViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = StudentProfile.objects.select_related(
        'student'
    ).all()

    serializer_class = StudentProfileSerializer