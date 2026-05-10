from rest_framework.routers import DefaultRouter

from apps.ai_routes.views import (
    StudentProfileViewSet,
    LearningRouteViewSet,
    LearningRouteTopicViewSet,
    StudentProgressViewSet
)

router = DefaultRouter()

router.register(
    r'student-profiles',
    StudentProfileViewSet
)

router.register(
    r'learning-routes',
    LearningRouteViewSet
)

router.register(
    r'learning-route-topics',
    LearningRouteTopicViewSet
)

router.register(
    r'student-progress',
    StudentProgressViewSet
)

urlpatterns = router.urls