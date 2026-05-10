import uuid

from django.db import models


class Role(models.Model):

    class RoleChoices(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        TUTOR = 'TUTOR', 'Tutor'
        STUDENT = 'STUDENT', 'Estudiante'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    name = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = 'roles'
        ordering = ['name']
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.name