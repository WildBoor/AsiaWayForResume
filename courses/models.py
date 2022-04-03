from django.db import models
from django.contrib import admin

from user.models import User

# Create your models here.
class Course(models.Model):
    title = models.CharField(max_length=100, db_index=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    price = models.FloatField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['author', 'created_at', 'updated_at']


class UserCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    pay_date =  models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['user']