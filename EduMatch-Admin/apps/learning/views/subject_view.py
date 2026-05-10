from rest_framework import viewsets

from apps.learning.models import Subject
from apps.learning.serializers import SubjectSerializer

from apps.users.permissions import IsAdminUserRole

from rest_framework import filters
from django_filters.rest_framework import (
    DjangoFilterBackend
)

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['Learning']
)

class SubjectViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = Subject.objects.all()

    serializer_class = SubjectSerializer

    filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
    filters.OrderingFilter
    ]

    search_fields = [
        'name',
        'description'
    ]

    ordering_fields = [
        'name',
        'created_at'
    ]

    ordering = [
        'name'
    ]