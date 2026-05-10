from rest_framework import serializers

from apps.tutors.models import TutorSubject


class TutorSubjectSerializer(serializers.ModelSerializer):

    tutor_name = serializers.CharField(
        source='tutor.user.full_name',
        read_only=True
    )

    subject_name = serializers.CharField(
        source='subject.name',
        read_only=True
    )

    class Meta:
        model = TutorSubject

        fields = '__all__'