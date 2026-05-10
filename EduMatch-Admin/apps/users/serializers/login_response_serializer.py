from rest_framework import serializers


class RoleResponseSerializer(serializers.Serializer):

    id = serializers.UUIDField()

    name = serializers.CharField()


class UserResponseSerializer(serializers.Serializer):

    id = serializers.UUIDField()

    email = serializers.EmailField()

    first_name = serializers.CharField()

    last_name = serializers.CharField()

    role = RoleResponseSerializer()


class LoginResponseSerializer(serializers.Serializer):

    user = UserResponseSerializer()

    access = serializers.CharField()

    refresh = serializers.CharField()