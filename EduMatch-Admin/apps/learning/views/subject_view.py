from rest_framework import viewsets

from apps.learning.models import Subject
from apps.learning.serializers import SubjectSerializer

from apps.users.permissions import IsAdminUserRole


class SubjectViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = Subject.objects.all()

    serializer_class = SubjectSerializer