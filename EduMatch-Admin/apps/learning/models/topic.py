import uuid

from django.db import models

from apps.learning.models.learning_module import LearningModule


class Topic(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    module = models.ForeignKey(
        LearningModule,
        on_delete=models.CASCADE,
        related_name='topics'
    )

    title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    estimated_minutes = models.PositiveIntegerField(
        default=30
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
        db_table = 'topics'
        ordering = ['order']
        verbose_name = 'Topic'
        verbose_name_plural = 'Topics'

    def __str__(self):
        return self.title