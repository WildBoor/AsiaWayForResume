from django import template

from services.user_services import get_profile_avatar_url

register = template.Library()


@register.simple_tag
def get_profile_avatar_url_tag(profile_id):
    profile_avatar_image_url = get_profile_avatar_url(profile_id)

    return profile_avatar_image_url
