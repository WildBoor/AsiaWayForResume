from django import forms
from static.ckeditor_uploader.widgets import CKEditorUploadingWidget

from posts.models import Post, PostComment


class PostCreateForm(forms.ModelForm):
    class Meta:
        model = Post

        fields = ['title', 'content']

        widgets = {
            'title': forms.TextInput(
                attrs={
                    'class': 'title',
                    'placeholder': 'Title',
                }),
            'content': CKEditorUploadingWidget(),
        }

        error_messages = {
            'title': {
                'required': 'Please, enter post title.',
                'max_length': 'Post title is too long',
            },
            'content': {
                'required': 'Post content can not be empty.',
                'max_length': 'Post content is too long.',
            },
        }


class PostCommentForm(forms.ModelForm):
    class Meta:
        model = PostComment

        fields = ['content']

        widgets = {
            'content': forms.Textarea(
                attrs={
                    'class': 'content',
                    'placeholder': 'Leave your comment here...',
                }),
        }

        error_messages = {
            'content': {
                'required': 'Comment content can not be empty.',
                'min_length': 'Comment content is too long.',
                'max_length': 'Comment content is too long.',
            },
        }
