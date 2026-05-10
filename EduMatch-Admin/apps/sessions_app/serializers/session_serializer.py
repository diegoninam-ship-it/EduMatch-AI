from rest_framework import serializers

from apps.sessions_app.models import Session


class SessionSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source='student.full_name',
        read_only=True
    )

    tutor_name = serializers.CharField(
        source='tutor.user.full_name',
        read_only=True
    )

    subject_name = serializers.CharField(
        source='subject.name',
        read_only=True
    )

    class Meta:
        model = Session

        fields = '__all__'

        read_only_fields = (
            'id',
            'created_at',
            'updated_at'
        )