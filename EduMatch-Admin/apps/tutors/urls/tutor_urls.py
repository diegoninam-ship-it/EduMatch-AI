from rest_framework.routers import DefaultRouter

from apps.tutors.views import (
    TutorViewSet,
    TutorSubjectViewSet,
    AvailabilitySlotViewSet
)

router = DefaultRouter()

router.register(
    r'tutors',
    TutorViewSet,
    basename='tutors'
)

router.register(
    r'tutor-subjects',
    TutorSubjectViewSet,
    basename='tutor-subjects'
)

router.register(
    r'availability-slots',
    AvailabilitySlotViewSet,
    basename='availability-slots'
)

urlpatterns = router.urls