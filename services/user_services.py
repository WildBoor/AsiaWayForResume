from user.models import *

from . import posts_services
from config.settings import MEDIA_URL


def get_profile_avatar_url(profile_id):

    profile_avatar_image = ProfileAvatarImage.objects.filter(profile=profile_id).values('avatar_image_url')
    profile_avatar_image_url = None
    
    for obj in profile_avatar_image:
        profile_avatar_image_url = obj.get('avatar_image_url')

    return profile_avatar_image_url


def get_profile_info(profile_id, user_email):
    profile_avatar_url = get_profile_avatar_url(profile_id)
    profile_posts_total = posts_services.count_profile_posts(profile_id)
    profile_comments_total = posts_services.count_profile_posts_comments(profile_id)

    profile_info = {
        'email': user_email,
        'avatar_url': profile_avatar_url,
        'posts_total': profile_posts_total,
        'comments_total': profile_comments_total,
    }

    return profile_info


def get_media_url(url):
    return MEDIA_URL + str(url)