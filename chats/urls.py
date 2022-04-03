from django.urls import path

from .views import *

urlpatterns = [
    path('', user_chats, name="user_chats"),
]