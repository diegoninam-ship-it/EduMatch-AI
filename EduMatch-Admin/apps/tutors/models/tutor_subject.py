import uuid

from django.db import models

from apps.tutors.models.tutor import Tutor
from apps.learning.models import Subject


class TutorSubject(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    tutor = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='subjects'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='tutors'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'tutor_subjects'
        unique_together = ('tutor', 'subject')

    def __str__(self):
        return f'{self.tutor} - {self.subject}'