from rest_framework import serializers

from apps.ai_routes.models import StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentProfile
        fields = '__all__'