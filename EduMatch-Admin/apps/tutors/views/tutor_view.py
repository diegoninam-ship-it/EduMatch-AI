from rest_framework import filters
from rest_framework import viewsets

from django_filters.rest_framework import (
    DjangoFilterBackend
)

from apps.tutors.models import Tutor
from apps.tutors.serializers import TutorSerializer

from apps.users.permissions import (
    IsAdminUserRole
)

from drf_spectacular.utils import (
    extend_schema
)


@extend_schema(
    tags=['Tutors']
)
class TutorViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = Tutor.objects.select_related(
        'user'
    ).all()

    serializer_class = TutorSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = [
        'is_available'
    ]

    search_fields = [
        'user__full_name',
        'biography'
    ]

    ordering_fields = [
        'hourly_rate',
        'rating',
        'created_at'
    ]

    ordering = [
        '-created_at'
    ]