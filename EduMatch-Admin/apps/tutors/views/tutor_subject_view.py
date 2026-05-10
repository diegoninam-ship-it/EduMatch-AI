from rest_framework import viewsets

from apps.tutors.models import TutorSubject
from apps.tutors.serializers import TutorSubjectSerializer

from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['Tutors']
)
class TutorSubjectViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = TutorSubject.objects.select_related(
        'tutor',
        'subject'
    ).all()

    serializer_class = TutorSubjectSerializer