from rest_framework.routers import DefaultRouter

from apps.learning.views import (
    SubjectViewSet,
    LearningModuleViewSet,
    TopicViewSet
)

router = DefaultRouter()

router.register(
    r'subjects',
    SubjectViewSet,
    basename='subjects'
)

router.register(
    r'modules',
    LearningModuleViewSet,
    basename='modules'
)

router.register(
    r'topics',
    TopicViewSet,
    basename='topics'
)

urlpatterns = router.urls