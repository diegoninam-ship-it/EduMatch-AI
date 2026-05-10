from django.contrib import admin

from apps.users.models import Role, User


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'created_at'
    )

    search_fields = (
        'name',
    )


@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = (
        'email',
        'first_name',
        'last_name',
        'role',
        'is_active'
    )

    search_fields = (
        'email',
        'first_name',
        'last_name'
    )

    list_filter = (
        'role',
        'is_active'
    )
