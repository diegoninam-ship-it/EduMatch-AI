from rest_framework import status
from rest_framework import viewsets

from rest_framework.response import Response

from apps.ai_routes.models import LearningRoute

from apps.ai_routes.serializers import (
    LearningRouteSerializer
)

from apps.ai_routes.services.ai_route_service import (
    AIRouteService
)

from rest_framework import filters

from django_filters.rest_framework import (
    DjangoFilterBackend
)

from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['AI Routes']
)
class LearningRouteViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = LearningRoute.objects.select_related(
        'student',
        'subject'
    ).all()

    serializer_class = LearningRouteSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        learning_route = serializer.save()

        AIRouteService.generate_route_topics(
            learning_route=learning_route,
            subject=learning_route.subject
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
    filters.OrderingFilter
    ]

    filterset_fields = [
        'status',
        'generated_by_ai'
    ]

    search_fields = [
        'title',
        'description'
    ]

    ordering_fields = [
        'created_at'
    ]

    ordering = [
        '-created_at'
    ]