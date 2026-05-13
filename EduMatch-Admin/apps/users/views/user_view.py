from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.models import User
from apps.users.models.admin_action_log import AdminActionLog
from apps.users.serializers import UserSerializer
from apps.users.permissions import IsAdminUserRole

from drf_spectacular.utils import extend_schema


@extend_schema(tags=['Users'])
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUserRole]
    queryset = User.objects.select_related('role').all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['patch'], url_path='toggle-status')
    def toggle_status(self, request, pk=None):
        """Suspender o reactivar una cuenta de usuario"""
        user = self.get_object()
        reason = request.data.get('reason', '')

        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])

        action_type = AdminActionLog.ActionChoices.REACTIVATE if user.is_active else AdminActionLog.ActionChoices.SUSPEND

        AdminActionLog.objects.create(
            admin=request.user,
            target_user=user,
            action=action_type,
            reason=reason
        )

        return Response({
            'id': str(user.id),
            'email': user.email,
            'is_active': user.is_active,
            'action': action_type,
            'message': f'Usuario {"reactivado" if user.is_active else "suspendido"} correctamente'
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='action-logs')
    def action_logs(self, request, pk=None):
        """Ver historial de acciones sobre un usuario"""
        user = self.get_object()
        logs = AdminActionLog.objects.filter(target_user=user).select_related('admin')
        data = [
            {
                'id': str(log.id),
                'action': log.action,
                'reason': log.reason,
                'admin': log.admin.email if log.admin else 'Sistema',
                'created_at': log.created_at.isoformat()
            }
            for log in logs
        ]
        return Response(data, status=status.HTTP_200_OK)
