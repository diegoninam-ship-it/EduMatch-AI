from rest_framework import serializers

from apps.ai_routes.models import StudentProgress


class StudentProgressSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = StudentProgress
        fields = '__all__'