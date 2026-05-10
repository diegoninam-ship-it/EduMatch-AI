from rest_framework import viewsets

from apps.ai_routes.models import LearningRouteTopic

from apps.ai_routes.serializers import (
    LearningRouteTopicSerializer
)

from apps.users.permissions import IsAdminUserRole


class LearningRouteTopicViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsAdminUserRole]

    queryset = LearningRouteTopic.objects.select_related(
        'learning_route',
        'topic'
    ).all()

    serializer_class = LearningRouteTopicSerializer