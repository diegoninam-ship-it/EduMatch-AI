from rest_framework import viewsets

from apps.tutors.models import Tutor
from apps.tutors.serializers import TutorSerializer

from apps.users.permissions import IsAdminUserRole


class TutorViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = Tutor.objects.select_related(
        'user'
    ).all()

    serializer_class = TutorSerializer