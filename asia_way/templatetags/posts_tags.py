from re import search
from django import template

from services.posts_services import get_all_categories_and_subcategories
from services.posts_services import get_limit_posts
from services.posts_services import get_posts_for_carousel_temp
from services.posts_services import get_posts_for_title_temp
from services.posts_services import get_posts_for_card_temp
from services.posts_services import get_post_comments

register = template.Library()

@register.inclusion_tag('pages/posts/postSearchCheckboxes.html')
def get_posts_categories_and_subcategories_tag():
    return { 'categories_and_subcategories': get_all_categories_and_subcategories() }


@register.inclusion_tag('pages/posts/postPreviewTemplate.html')
def get_limit_posts_tag(limit=10):
    posts = get_limit_posts(limit)
    return { 'posts': posts }


@register.inclusion_tag('pages/posts/carouselPostTemplate.html')
def get_carousel_posts_tag():
    posts = get_posts_for_carousel_temp()
    return { 'posts': posts }


@register.inclusion_tag('pages/posts/textPostTemplate.html')
def get_title_posts_tag():
    posts = get_posts_for_title_temp()
    return { 'posts': posts }


@register.inclusion_tag('pages/posts/cardPostTemplate.html')
def get_card_posts_tag():
    posts = get_posts_for_card_temp()
    return { 'posts': posts }


@register.inclusion_tag('pages/posts/postCommentTemplate.html')
def get_post_comments_tag(post_id):
    comments = get_post_comments(post_id)
    return { 'comments': comments }