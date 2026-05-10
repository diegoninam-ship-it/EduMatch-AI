from rest_framework import viewsets

from apps.tutors.models import AvailabilitySlot
from apps.tutors.serializers import AvailabilitySlotSerializer

from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import (
    extend_schema
)

@extend_schema(
    tags=['Tutors']
)
class AvailabilitySlotViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = AvailabilitySlot.objects.select_related(
        'tutor'
    ).all()

    serializer_class = AvailabilitySlotSerializer