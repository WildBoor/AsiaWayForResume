from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

import json

from services.posts_services import *
from . import post_forms

# Create your views here.


def posts_index(request):
    return render(request, "pages/posts/posts.html")


def post(request, post_id):
    post = get_post_by_id(post_id)
    post_comment_form = post_forms.PostCommentForm()
    context = {
        'post': post,
        'post_comment_form': post_comment_form
    }

    return render(request, "pages/posts/post.html", context)


@login_required
def update_post_comments(request, post_id):
    if request.method == 'POST':
        request_body_data = json.loads(request.body)

        post_comment_form = post_forms.PostCommentForm(request_body_data)

        if post_comment_form.is_valid():
            post = Post.objects.get(pk=post_id)
            author = request.user.profile
            comment_content = post_comment_form.cleaned_data['content']

            new_comment_data = save_new_post_comment(post, author, comment_content)

            return JsonResponse({
                'status': 'success',
                'success_message': 'Comment was saved!',
                'new_comment_data': new_comment_data,
                })
        else:
            post_create_form_errors = post_comment_form.errors.as_json()
            
            return JsonResponse({'errors': post_create_form_errors, 'status': 'error'})


@login_required
def post_create(request):

    postCreateForm = post_forms.PostCreateForm()

    return render(request, "pages/posts/postCreate.html", {'post_create_form': postCreateForm})


@login_required
def create_new_post(request):
    if request.method == 'POST':

        request_body_data = json.loads(request.body)
        new_post_categories = request_body_data.get('post_subcategory')
        new_post_preview_image_url = request_body_data.get('preview_image_url')
        new_post_preview_text = request_body_data.get('preview_text')

        validate_new_post_categories(new_post_categories)
        post_create_form = post_forms.PostCreateForm(request_body_data)

        if post_create_form.is_valid():
            new_post_data = {
                'new_post_categories': new_post_categories,
                'new_post_preview_image_url': new_post_preview_image_url,
                'new_post_preview_text': new_post_preview_text,
            }

            new_post = save_new_post(request.user, post_create_form, new_post_data)

            return JsonResponse({
                'status': 'success',
                'successMessage': 'Post was saved!',
                'redirect_url': new_post.get_absolute_url()
                })
        else:
            post_create_form_errors = post_create_form.errors.as_json()
            
            return JsonResponse({'errors': post_create_form_errors, 'status': 'error'})


def get_searched_posts(request):
    if request.method == 'POST':
        requestBodyData = json.loads(request.body)

        limit = 10
        offset = requestBodyData.get('offset')
        searchedPosts = get_limit_posts(limit, offset, requestBodyData)

        if searchedPosts:
            return JsonResponse({'status': 'success', 'response': searchedPosts})
        else:
            return JsonResponse({'status': 'no posts'})
