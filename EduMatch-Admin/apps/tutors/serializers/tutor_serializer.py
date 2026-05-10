from rest_framework import serializers

from apps.tutors.models import Tutor


class TutorSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(
        source='user.full_name',
        read_only=True
    )

    email = serializers.CharField(
        source='user.email',
        read_only=True
    )

    class Meta:
        model = Tutor

        fields = '__all__'

        read_only_fields = (
            'id',
            'rating',
            'created_at',
            'updated_at'
        )