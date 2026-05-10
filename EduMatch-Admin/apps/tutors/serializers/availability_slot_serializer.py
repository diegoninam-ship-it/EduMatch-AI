from rest_framework import serializers

from apps.tutors.models import AvailabilitySlot


class AvailabilitySlotSerializer(serializers.ModelSerializer):

    tutor_name = serializers.CharField(
        source='tutor.user.full_name',
        read_only=True
    )

    class Meta:
        model = AvailabilitySlot

        fields = '__all__'