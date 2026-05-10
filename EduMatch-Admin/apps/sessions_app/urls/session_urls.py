from rest_framework.routers import DefaultRouter

from apps.sessions_app.views import SessionViewSet


router = DefaultRouter()

router.register(
    r'sessions',
    SessionViewSet,
    basename='sessions'
)

urlpatterns = router.urls