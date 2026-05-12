from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from apps.users.models import User, Role


class RegisterSerializer(serializers.Serializer):
    """
    Serializer para el registro de nuevos usuarios
    """
    nombre = serializers.CharField(
        write_only=True,
        required=True,
        min_length=3,
        max_length=150,
        error_messages={
            'required': 'El nombre es obligatorio',
            'blank': 'El nombre no puede estar vacío',
            'min_length': 'El nombre debe tener al menos 3 caracteres',
            'max_length': 'El nombre no puede exceder 150 caracteres',
        }
    )
    
    correo = serializers.EmailField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'El correo es obligatorio',
            'blank': 'El correo no puede estar vacío',
            'invalid': 'Ingresa un correo válido',
        }
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        error_messages={
            'required': 'La contraseña es obligatoria',
            'blank': 'La contraseña no puede estar vacía',
            'min_length': 'La contraseña debe tener al menos 6 caracteres',
        }
    )
    
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        error_messages={
            'required': 'Debes confirmar la contraseña',
            'blank': 'La confirmación no puede estar vacía',
            'min_length': 'La confirmación debe tener al menos 6 caracteres',
        }
    )

    def validate_correo(self, value):
        """Validar que el email no esté registrado"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Este correo ya está registrado. Intenta con otro o inicia sesión.'
            )
        return value

    def validate(self, data):
        """Validaciones del serializer"""
        password = data.get('password')
        password_confirm = data.get('password_confirm')

        # Validar que las contraseñas coincidan
        if password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden'
            })

        # Validar contraseña usando validadores de Django
        try:
            validate_password(password)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })

        return data

    def create(self, validated_data):
        """Crear nuevo usuario"""
        nombre = validated_data.get('nombre')
        correo = validated_data.get('correo')
        password = validated_data.get('password')

        # Dividir nombre en first_name y last_name
        nombre_parts = nombre.split(' ', 1)
        first_name = nombre_parts[0]
        last_name = nombre_parts[1] if len(nombre_parts) > 1 else ''

        # Obtener rol de estudiante por defecto
        student_role = Role.objects.get(name=Role.RoleChoices.STUDENT)

        # Crear usuario
        user = User.objects.create_user(
            email=correo,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=student_role,
            is_active=True
        )

        return user
