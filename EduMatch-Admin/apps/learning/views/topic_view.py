from rest_framework import viewsets

from apps.learning.models import Topic
from apps.learning.serializers import TopicSerializer

from apps.users.permissions import IsAdminUserRole


class TopicViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = Topic.objects.select_related(
        'module'
    ).all()

    serializer_class = TopicSerializer