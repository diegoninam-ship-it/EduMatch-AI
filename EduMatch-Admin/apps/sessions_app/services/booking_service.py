from apps.sessions_app.models import Session


class BookingService:

    @staticmethod
    def validate_slot_availability(
        tutor,
        session_date,
        start_time,
        end_time
    ):

        existing_session = Session.objects.filter(
            tutor=tutor,
            session_date=session_date,
            start_time=start_time,
            end_time=end_time,
            status__in=[
                'PENDING',
                'CONFIRMED'
            ]
        ).exists()

        return not existing_session