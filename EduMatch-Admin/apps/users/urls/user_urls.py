from rest_framework.routers import DefaultRouter

from apps.users.views import (
    RoleViewSet,
    UserViewSet
)

router = DefaultRouter()

router.register(
    r'roles',
    RoleViewSet,
    basename='roles'
)

router.register(
    r'users',
    UserViewSet,
    basename='users'
)

urlpatterns = router.urls