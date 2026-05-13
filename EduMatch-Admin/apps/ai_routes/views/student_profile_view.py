from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.ai_routes.models import StudentProfile
from apps.ai_routes.serializers import StudentProfileSerializer
from apps.users.permissions import IsAdminUserRole
from drf_spectacular.utils import extend_schema


@extend_schema(tags=['AI Routes'])
class StudentProfileViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUserRole]
    queryset = StudentProfile.objects.select_related('student').all()
    serializer_class = StudentProfileSerializer

    @action(
        detail=False,
        methods=['get', 'put', 'patch'],
        permission_classes=[IsAuthenticated],
        url_path='me'
    )
    def me(self, request):
        """Obtener o actualizar el perfil del estudiante autenticado"""
        try:
            profile = StudentProfile.objects.get(student=request.user)
        except StudentProfile.DoesNotExist:
            profile = None

        if request.method == 'GET':
            if not profile:
                return Response(
                    {'detail': 'Perfil no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = StudentProfileSerializer(profile)
            return Response(serializer.data)

        # PUT o PATCH — crear o actualizar
        if profile:
            serializer = StudentProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )
        else:
            data = {**request.data, 'student': str(request.user.id)}
            serializer = StudentProfileSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
