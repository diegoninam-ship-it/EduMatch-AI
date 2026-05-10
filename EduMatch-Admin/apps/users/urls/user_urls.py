from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.users.views import (
    RoleViewSet,
    UserViewSet,
    LoginView,
    MeView
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

urlpatterns = router.urls + [

    path(
        'auth/login/',
        LoginView.as_view(),
        name='login'
    ),

    path(
        'auth/me/',
        MeView.as_view(),
        name='me'
    ),
]