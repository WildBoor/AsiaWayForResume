from django.urls import path

from .views import *

urlpatterns = [
    path('', courses_index, name="courses_index"),
    path('<int:course_id>/', course, name="course"), #поменять 'course_id/' на id курса
]