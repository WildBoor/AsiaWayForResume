from django.db import models
from django.contrib import admin

from user.models import User

# Create your models here.
class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chat_members = models.JSONField()

    class Meta:
        ordering = ['user']


