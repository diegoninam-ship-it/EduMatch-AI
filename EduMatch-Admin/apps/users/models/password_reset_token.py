import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta


class PasswordResetToken(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='reset_tokens'
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField()

    used = models.BooleanField(
        default=False
    )

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=30)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at

    class Meta:
        db_table = 'password_reset_tokens'
        verbose_name = 'Token de recuperación'
        verbose_name_plural = 'Tokens de recuperación'
