from django import template

from services.user_services import get_media_url

register = template.Library()

@register.simple_tag
def media(url=''):
    return get_media_url(url)