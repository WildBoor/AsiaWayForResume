from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from services.user_services import get_profile_info
from services.posts_services import get_profile_posts
from services.posts_services import get_profile_comments

# Create your views here.

def user(request, profile_id):
    user_email = request.user.email
    profile_info = get_profile_info(profile_id, user_email)

    posts_limit = 5
    comments_limit = 5
    profile_posts = get_profile_posts(posts_limit, profile_id)
    # profile_comments = get_profile_comments(comments_limit, profile_id)

    return render(request, "pages/user/user.html", {
        **profile_info,
        'profile_posts': profile_posts,
    })


@login_required
def user_settings(request, profile_id):
    return render(request, "pages/user/settings.html", {})


@login_required
def user_settings_update(request):
    return render(request, "pages/user/settings.html", {})


@login_required
def user_messages(request):
    return render(request, "", {})


@login_required
def user_favourites(request):
    return render(request, "pages/user/favourites.html", {})


@login_required
def user_dashboard(request):
    return render(request, "pages/user/dashboard.html", {})
