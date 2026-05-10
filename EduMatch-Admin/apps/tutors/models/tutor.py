import uuid

from django.db import models

from apps.users.models import User


class Tutor(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='tutor_profile'
    )

    biography = models.TextField()

    experience_years = models.PositiveIntegerField(
        default=0
    )

    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )

    is_available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = 'tutors'
        verbose_name = 'Tutor'
        verbose_name_plural = 'Tutors'

    def __str__(self):
        return self.user.full_name