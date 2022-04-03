from django.urls import path

from .views import *

urlpatterns = [
    path('', posts_index, name="posts_index"),
    path('get_searched_posts/', get_searched_posts, name="get_searched_posts"),
    path('post/<int:post_id>/', post, name="post"),
    path('post/<int:post_id>/update_post_comments/', update_post_comments, name="update_post_comments"),
    path('create/', post_create, name="post_create"),
    path('create/create_new_post/', create_new_post, name="create_new_post"),
]