import uuid

from django.db import models

from apps.ai_routes.models.learning_route import (
    LearningRoute
)

from apps.learning.models import Topic


class LearningRouteTopic(models.Model):

    class TopicStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    learning_route = models.ForeignKey(
        LearningRoute,
        on_delete=models.CASCADE,
        related_name='route_topics'
    )

    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE
    )

    order = models.PositiveIntegerField(
        default=1
    )

    status = models.CharField(
        max_length=20,
        choices=TopicStatus.choices,
        default=TopicStatus.PENDING
    )

    class Meta:
        db_table = 'learning_route_topics'
        ordering = ['order']