from django.urls import path, include

from .views import *

urlpatterns = [
    path('<int:profile_id>/', user, name="user"), 
    path('<int:profile_id>/settings/', user_settings, name="user_settings"),
    path('<int:profile_id>/settings/update/', user_settings_update, name="user_settings_update"),
    path('<int:profile_id>/messages/', user_messages, name="user_messages"),
    path('<int:profile_id>/favourites/', user_favourites, name="user_favourites"),
    path('<int:profile_id>/dashboard/', user_dashboard, name="user_dashboard"),
    path('<int:profile_id>/posts/', include('posts.urls')),
    path('<int:profile_id>/chats/', include('chats.urls')),
]
