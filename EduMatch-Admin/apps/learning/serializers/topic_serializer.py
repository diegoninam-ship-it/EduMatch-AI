from rest_framework import serializers

from apps.learning.models import Topic


class TopicSerializer(serializers.ModelSerializer):

    module_name = serializers.CharField(
        source='module.title',
        read_only=True
    )

    class Meta:
        model = Topic

        fields = '__all__'

        read_only_fields = (
            'id',
            'created_at',
            'updated_at'
        )