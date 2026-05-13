from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.users.views import (
    RoleViewSet,
    UserViewSet,
    LoginView,
    LogoutView,
    RegisterView,
    MeView,
    ForgotPasswordView,
    ResetPasswordView
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
        'auth/register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'auth/me/',
        MeView.as_view(),
        name='me'
    ),

    path(
        'auth/forgot-password/',
        ForgotPasswordView.as_view(),
        name='forgot-password'
    ),

    path(
        'auth/reset-password/',
        ResetPasswordView.as_view(),
        name='reset-password'
    ),

    path(
        'auth/logout/',
        LogoutView.as_view(),
        name='logout'
    ),
]