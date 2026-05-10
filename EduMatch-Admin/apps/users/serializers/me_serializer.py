from rest_framework import serializers


class MeSerializer(serializers.Serializer):

    id = serializers.UUIDField()

    email = serializers.EmailField()

    first_name = serializers.CharField()

    last_name = serializers.CharField()

    role = serializers.CharField()