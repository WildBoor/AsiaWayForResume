from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Q
import json

from posts.models import *
from . import user_services


def get_all_categories_and_subcategories():
    cat_subcat = PostSubcategory.objects.select_related('post_category').values(
        'id',
        'post_subcategory',
        'post_category',
        'post_category__post_category'
    ).all()

    categories = PostCategory.objects.all()

    categories_with_subcategories = {}

    for row in cat_subcat:
        category_id = row['post_category']
        category_name = row['post_category__post_category']
        subcategory_id = row['id']
        subcategory_name = row['post_subcategory']

        if not categories_with_subcategories.get(category_name):
            categories_with_subcategories[category_name] = {}
            categories_with_subcategories[category_name] = {
                'category_id': category_id,
                'category_name': category_name,
                'subcategories': {}
            }

        categories_with_subcategories[category_name]['subcategories'][subcategory_name] = {
            'subcategory_id': subcategory_id,
            'subcategory_name': subcategory_name
        }

    categories_with_subcategories_keys = categories_with_subcategories.keys()

    for category in categories:
        category_name = category.post_category
        if category_name not in categories_with_subcategories_keys:
            categories_with_subcategories[category_name] = {}
            categories_with_subcategories[category_name] = {
                'category_id': category_id,
                'category_name': category_name,
                'subcategories': {}
            }

    return categories_with_subcategories


def validate_new_post_categories(newPostCategories):
    if newPostCategories is None or not len(newPostCategories):
        errorMessage = {'post_subcategory': [
            {'message': 'Choose categories for your post.'}]}

        return JsonResponse({
            'errors': json.dumps(errorMessage),
            'status': 'error'
        })


def save_new_post(user, post_create_form, new_post_data):
    new_post_categories = new_post_data['new_post_categories']

    categories_ids = []
    subcategories_ids = []

    for category_name in new_post_categories:
        if 'category_id' in new_post_categories.get(category_name):
            category_id = new_post_categories.get(category_name)['category_id']
            categories_ids.append(category_id)

        if 'subcategories' in new_post_categories.get(category_name):
            subcategory_ids = new_post_categories.get(category_name)[
                'subcategories']

        for subcategory_id in subcategory_ids:
            subcategories_ids.append(subcategory_id)

    user_profile = Profile.objects.get(user=user.id)

    new_post = Post(
        title=post_create_form.cleaned_data['title'],
        content=post_create_form.cleaned_data['content'],
        preview_image_url=new_post_data['new_post_preview_image_url'],
        preview_text=new_post_data['new_post_preview_text'],
        author=user_profile
    )

    new_post.save()

    new_post.post_category.set(categories_ids)
    new_post.post_subcategory.set(subcategories_ids)

    new_post.save()

    return new_post


def get_limit_posts(limit, offset=0, search_params=None):

    if search_params:
        final_Q_list = []

        if search_params.get('time_period'):
            start_date = timezone.now()
            end_date_name = search_params.get('time_period')
            delta = None

            if end_date_name == 'Today':
                delta = timezone.timedelta(hours=24)
            elif end_date_name == 'Yesterday':
                delta = timezone.timedelta(days=1)
            elif end_date_name == 'Week':
                delta = timezone.timedelta(days=7)
            elif end_date_name == 'Month':
                delta = timezone.timedelta(days=30)
            elif end_date_name == 'Year':
                delta = timezone.timedelta(days=365)

            final_Q_list.append(
                Q(created_at__range=(start_date - delta, start_date)))

        if search_params.get('search_string'):
            final_Q_list.append(
                Q(title__icontains=search_params.get('search_string')))

        for key in search_params.keys():
            categories_ids = []
            subcategories_ids = []

            if (key != 'search_string' and
                key != 'time_period' and
                    key != 'offset'):
                if search_params.get(key).get('is_category_checked'):
                    if search_params.get(key).get('category_id') is not None:
                        categories_ids.append(
                            search_params.get(key).get('category_id'))
                else:
                    for subcategory_id in search_params.get(key).get('subcategories'):
                        subcategories_ids.append(subcategory_id)

            if bool(categories_ids):
                final_Q_list.append(Q(post_category__in=categories_ids))

            if bool(subcategories_ids):
                final_Q_list.append(Q(post_subcategory__in=subcategories_ids))
        posts = Post.objects.select_related('author').filter(
            *final_Q_list)[offset:offset + limit]

    else:
        posts = Post.objects.select_related(
            'author')[offset:limit]

    posts_for_template = {}

    for post in posts:
        post_author_avatar_url = user_services.get_profile_avatar_url(post.author)
        post_comments_total = count_post_comments(post)

        post_created_at = post.created_at.strftime('%a %d %B %Y')

        posts_for_template.update({
            post.pk: {
                'id': post.id,
                'title': post.title,
                'preview_image_url': post.preview_image_url,
                'preview_text': post.preview_text,
                'created_at': post_created_at,
                'author_id': post.author.pk,
                'author_login': post.author.user.username,
                'author_avatar_url': post_author_avatar_url,
                'comments_total': post_comments_total,
            }
        })

    return posts_for_template


def get_post_by_id(pk):
    post = Post.objects.get(pk=pk)

    post_author_avatar_url = user_services.get_profile_avatar_url(post.author)
    post_comments_total = count_post_comments(post)

    post_created_at = post.created_at.strftime('%a %d %B %Y')

    post_for_view = {
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'created_at': post_created_at,
        'author_id': post.author.pk,
        'author_login': post.author.user.username,
        'author_avatar_url': post_author_avatar_url,
        'comments_total': post_comments_total,
    }

    return post_for_view


def count_post_comments(post_id):
    post_comments_total = PostComment.objects.filter(commented_post=post_id).count()

    return post_comments_total

def count_profile_posts_comments(profile_id):
    total = PostComment.objects.filter(author=profile_id).count()
    return total


def count_profile_posts(profile_id):
    total = Post.objects.filter(author=profile_id).count()
    return total


def get_profile_posts(limit, profile_id):
    profile_posts = Post.objects.filter(author=profile_id)[:limit]
    posts_for_template ={}

    for post in profile_posts:
        post_created_at = post.created_at.strftime('%a %d %B %Y')
        profile_comments_total = count_post_comments(post.pk)

        posts_for_template.update({
                post.pk: {
                    'id': post.id,
                    'title': post.title,
                    'preview_image_url': post.preview_image_url,
                    'preview_text': post.preview_text,
                    'created_at': post_created_at,
                    'author_id': profile_id,
                    'author_login': post.author.user.username,
                    'author_avatar_url': user_services.get_profile_avatar_url(profile_id),
                    'comments_total': profile_comments_total,
                }
            })

    return ''


def get_profile_comments(limit, profile_id):
    return ''


def get_posts_for_carousel_temp():
    time_period = 'Week'
    offset = 0
    amount_of_posts_for_each_category = 4
    responsePosts = {}

    search_categories = {
        'Asia': {
            'is_category_checked': True,
            'category_id': 6,
        },
        'Business': {
            'is_category_checked': True,
            'category_id': 3,
        },
        'Politics': {
            'is_category_checked': True,
            'category_id': 1,
        }
    }

    for category_name in search_categories:
        search_params = {
            'time_period': time_period,
            category_name: search_categories.get(category_name)
        }

        posts = get_limit_posts(
            amount_of_posts_for_each_category, offset, search_params)

        for post_id in posts:
            responsePosts.update({
                post_id: {
                    'id': posts.get(post_id)['id'],
                    'title': posts.get(post_id)['title'],
                    'preview_image_url': posts.get(post_id)['preview_image_url'],
                    'preview_text': posts.get(post_id)['preview_text'],
                }
            })

    return responsePosts


def get_posts_for_title_temp():
    posts = Post.objects.select_related('post_subcategory')
    posts = posts.filter(post_subcategory__post_subcategory='China')
    posts = posts.values('id', 'author', 'title', 'created_at')[:4]
    responsePosts = {}

    for post in posts:
        post_comments_total = count_post_comments(post.get('id'))
        post_created_at = post.get('created_at').strftime('%B %d')
        

        responsePosts.update({
            post.get('id'): {
                'id': post.get('id'),
                'title': post.get('title'),
                'created_at': post_created_at,
                'comments_total': post_comments_total,
            }
        })
        
    return responsePosts


def get_posts_for_card_temp():
    post_subcategories_names = ['Awards', 'Hockey', 'Math', 'Japan']
    response_posts = {}

    for sub_name in post_subcategories_names:
        post = Post.objects.filter(post_subcategory__post_subcategory=sub_name).earliest()
        post_created_at = post.created_at.strftime('%B %d')

        response_posts.update({
            post.id: {
                'id': post.id,
                'title': post.title,
                'preview_image_url': post.preview_image_url,
                'created_at': post_created_at,
                'post_subcategory': sub_name,
            }
        })
        
    return response_posts


def get_post_comments(post_id):
    comments = PostComment.objects.filter(commented_post=post_id).all()
    response_comments = {}

    for comment in comments:
        post_author_avatar_image_url = user_services.get_profile_avatar_url(comment.author)
        created_at = comment.created_at.strftime('%d %B %Y')

        response_comments.update({
            comment.id: {
                'id': comment.id,
                'content': comment.content,
                'created_at': created_at,
                'author_id': comment.author.id,
                'author_login': comment.author.user.username,
                'author_avatar_url': post_author_avatar_image_url,
            }
        })

    return response_comments


def save_new_post_comment(post, author, comment_content):
    new_post_comment = PostComment(
        content=comment_content,
        author=author,
        commented_post=post
    )

    new_post_comment.save()

    comment_author_avatar_image_url = user_services.get_profile_avatar_url(author.id)
    created_at = new_post_comment.created_at.strftime('%d %B %Y')
    author_avatar_url = user_services.get_media_url(comment_author_avatar_image_url)
    author_url = '/user/{}/'.format(author.id)

    new_comment_data = {
        'author_url': author_url,
        'author_login': author.user.username,
        'author_avatar_url': author_avatar_url,
        'created_at': created_at,
        'content': new_post_comment.content,
    }

    return new_comment_data
