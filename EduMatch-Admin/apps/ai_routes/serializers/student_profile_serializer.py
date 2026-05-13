from rest_framework import serializers
from apps.ai_routes.models import StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentProfile
        fields = '__all__'
        extra_kwargs = {
            'student': {'required': False}
        }

    def create(self, validated_data):
        # Si no viene student, usa el usuario del request
        if 'student' not in validated_data:
            request = self.context.get('request')
            if request:
                validated_data['student'] = request.user
        return super().create(validated_data)
