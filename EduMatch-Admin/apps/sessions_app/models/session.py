import uuid

from django.db import models

from apps.users.models import User
from apps.tutors.models import Tutor
from apps.learning.models import Subject
from apps.tutors.models import AvailabilitySlot


class Session(models.Model):

    class SessionStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='student_sessions'
    )

    tutor = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='sessions'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name='sessions'
    )

    availability_slot = models.ForeignKey(
        AvailabilitySlot,
        on_delete=models.PROTECT,
        related_name='sessions'
    )

    session_date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    meeting_url = models.URLField(
        blank=True,
        null=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=SessionStatus.choices,
        default=SessionStatus.PENDING
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = 'sessions'
        ordering = ['-session_date']

    def __str__(self):
        return f'{self.student} - {self.tutor}'