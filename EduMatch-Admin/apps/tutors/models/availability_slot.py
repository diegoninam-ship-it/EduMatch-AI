import uuid

from django.db import models

from apps.tutors.models.tutor import Tutor


class AvailabilitySlot(models.Model):

    class WeekDays(models.TextChoices):
        MONDAY = 'MONDAY', 'Monday'
        TUESDAY = 'TUESDAY', 'Tuesday'
        WEDNESDAY = 'WEDNESDAY', 'Wednesday'
        THURSDAY = 'THURSDAY', 'Thursday'
        FRIDAY = 'FRIDAY', 'Friday'
        SATURDAY = 'SATURDAY', 'Saturday'
        SUNDAY = 'SUNDAY', 'Sunday'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    tutor = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='availability_slots'
    )

    day = models.CharField(
        max_length=20,
        choices=WeekDays.choices
    )

    start_time = models.TimeField()

    end_time = models.TimeField()

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'availability_slots'
        ordering = ['day', 'start_time']

    def __str__(self):
        return f'{self.day} - {self.start_time}'