from rest_framework import serializers

from apps.learning.models import LearningModule


class LearningModuleSerializer(serializers.ModelSerializer):

    subject_name = serializers.CharField(
        source='subject.name',
        read_only=True
    )

    class Meta:
        model = LearningModule

        fields = '__all__'

        read_only_fields = (
            'id',
            'created_at',
            'updated_at'
        )