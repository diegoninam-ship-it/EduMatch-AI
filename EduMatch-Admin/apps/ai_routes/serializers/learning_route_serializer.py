from rest_framework import serializers

from apps.ai_routes.models import LearningRoute


class LearningRouteSerializer(serializers.ModelSerializer):

    class Meta:
        model = LearningRoute
        fields = '__all__'