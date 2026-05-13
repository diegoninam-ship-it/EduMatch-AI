from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        # Nuevos campos en User
        migrations.AddField(
            model_name='user',
            name='login_attempts',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='blocked_until',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='email_verified',
            field=models.BooleanField(default=False),
        ),

        # Tabla PasswordResetToken
        migrations.CreateModel(
            name='PasswordResetToken',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('token', models.UUIDField(default=uuid.uuid4, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('used', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reset_tokens', to='users.user')),
            ],
            options={
                'verbose_name': 'Token de recuperación',
                'verbose_name_plural': 'Tokens de recuperación',
                'db_table': 'password_reset_tokens',
            },
        ),

        # Tabla AdminActionLog
        migrations.CreateModel(
            name='AdminActionLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('action', models.CharField(choices=[('SUSPEND', 'Suspender'), ('REACTIVATE', 'Reactivar'), ('DELETE', 'Eliminar')], max_length=20)),
                ('reason', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='actions_performed', to='users.user')),
                ('target_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions_received', to='users.user')),
            ],
            options={
                'verbose_name': 'Log de acción admin',
                'verbose_name_plural': 'Logs de acciones admin',
                'db_table': 'admin_action_logs',
                'ordering': ['-created_at'],
            },
        ),
    ]
