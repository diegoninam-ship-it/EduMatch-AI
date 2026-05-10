import uuid

from django.db import models

from apps.users.models import User
from apps.learning.models import Topic


class StudentProgress(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='progress_records'
    )

    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='student_progress'
    )

    progress_percentage = models.PositiveIntegerField(
        default=0
    )

    completed = models.BooleanField(
        default=False
    )

    last_interaction = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = 'student_progress'