from django.contrib.auth import authenticate

from rest_framework import serializers


class LoginSerializer(serializers.Serializer):

    correo = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        email = attrs.get('correo')
        password = attrs.get('password')

        user = authenticate(
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                'Credenciales inválidas'
            )

        if not user.is_active:
            raise serializers.ValidationError(
                'Usuario inactivo'
            )

        attrs['user'] = user

        return attrs