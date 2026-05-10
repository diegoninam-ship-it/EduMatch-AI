from rest_framework import serializers

from apps.ai_routes.models import LearningRouteTopic


class LearningRouteTopicSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = LearningRouteTopic
        fields = '__all__'