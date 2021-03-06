# Generated by Django 4.0.2 on 2022-03-26 19:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(choices=[('M', 'Male'), ('FM', 'Female')], default=('M', 'Male'), max_length=2)),
                ('birth_date', models.DateField(db_index=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProfileSocialUrl',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('twitter_account_url', models.URLField(blank=True, max_length=100)),
                ('vk_account_url', models.URLField(blank=True, max_length=100)),
                ('facebook_account_url', models.URLField(blank=True, max_length=100)),
                ('youtube_account_url', models.URLField(blank=True, max_length=100)),
                ('tik_tok_account_url', models.URLField(blank=True, max_length=100)),
                ('telegram_account_url', models.URLField(blank=True, max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ProfileFriend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('friends', models.JSONField()),
                ('profile', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.profile')),
            ],
        ),
        migrations.AddField(
            model_name='profile',
            name='social_links',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.profilesocialurl'),
        ),
        migrations.AddField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=100)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='user.profile')),
            ],
        ),
    ]
