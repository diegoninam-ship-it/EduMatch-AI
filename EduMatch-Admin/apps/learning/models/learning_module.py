import uuid

from django.db import models

from apps.learning.models.subject import Subject


class LearningModule(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='modules'
    )

    title = models.CharField(
        max_length=150
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    order = models.PositiveIntegerField(
        default=1
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = 'learning_modules'
        ordering = ['order']
        verbose_name = 'Learning Module'
        verbose_name_plural = 'Learning Modules'

    def __str__(self):
        return self.title