from rest_framework import status
from rest_framework import viewsets

from rest_framework.response import Response

from apps.sessions_app.models import Session
from apps.sessions_app.serializers import SessionSerializer

from apps.sessions_app.services.booking_service import (
    BookingService
)

from apps.users.permissions import IsAdminUserRole


class SessionViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]

    queryset = Session.objects.select_related(
        'student',
        'tutor',
        'subject',
        'availability_slot'
    ).all()

    serializer_class = SessionSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        tutor = serializer.validated_data['tutor']

        session_date = serializer.validated_data['session_date']

        start_time = serializer.validated_data['start_time']

        end_time = serializer.validated_data['end_time']

        is_available = BookingService.validate_slot_availability(
            tutor=tutor,
            session_date=session_date,
            start_time=start_time,
            end_time=end_time
        )

        if not is_available:

            return Response(
                {
                    'detail': 'Horario no disponible'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_create(serializer)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )