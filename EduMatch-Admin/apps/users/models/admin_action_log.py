import uuid
from django.db import models


class AdminActionLog(models.Model):

    class ActionChoices(models.TextChoices):
        SUSPEND = 'SUSPEND', 'Suspender'
        REACTIVATE = 'REACTIVATE', 'Reactivar'
        DELETE = 'DELETE', 'Eliminar'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    admin = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='actions_performed'
    )

    target_user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='actions_received'
    )

    action = models.CharField(
        max_length=20,
        choices=ActionChoices.choices
    )

    reason = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'admin_action_logs'
        ordering = ['-created_at']
        verbose_name = 'Log de acción admin'
        verbose_name_plural = 'Logs de acciones admin'
