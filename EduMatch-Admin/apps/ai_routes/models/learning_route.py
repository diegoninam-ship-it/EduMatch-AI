import uuid

from django.db import models

from apps.users.models import User
from apps.learning.models import Subject


class LearningRoute(models.Model):

    class RouteStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        COMPLETED = 'COMPLETED', 'Completed'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='learning_routes'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='learning_routes'
    )

    title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    generated_by_ai = models.BooleanField(
        default=True
    )

    status = models.CharField(
        max_length=20,
        choices=RouteStatus.choices,
        default=RouteStatus.ACTIVE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'learning_routes'