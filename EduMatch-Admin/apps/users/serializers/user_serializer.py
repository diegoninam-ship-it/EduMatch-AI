from rest_framework import serializers

from apps.users.models import *


class UserSerializer(serializers.ModelSerializer):

    role_name = serializers.CharField(
        source='role.name',
        read_only=True
    )

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = [
            'id',
            'role',
            'role_name',
            'first_name',
            'last_name',
            'email',
            'phone',
            'profile_image',
            'password',
            'is_active',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at'
        ]

    def create(self, validated_data):

        password = validated_data.pop('password')

        role = validated_data.get('role')

        user = User(**validated_data)

        if role.name == Role.RoleChoices.ADMIN:
            user.is_staff = True
            user.is_superuser = True

        user.set_password(password)

        user.save()

        return user

    def update(self, instance, validated_data):

        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance