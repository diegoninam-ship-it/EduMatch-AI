from rest_framework import viewsets

from apps.ai_routes.models import LearningRouteTopic

from apps.ai_routes.serializers import (
    LearningRouteTopicSerializer
)

from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['AI Routes']
)
class LearningRouteTopicViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsAdminUserRole]

    queryset = LearningRouteTopic.objects.select_related(
        'learning_route',
        'topic'
    ).all()

    serializer_class = LearningRouteTopicSerializer