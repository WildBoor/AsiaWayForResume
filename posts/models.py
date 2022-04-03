from django.db import models
from django.urls import reverse
from static.ckeditor_uploader.fields import RichTextUploadingField

from user.models import Profile
# Create your models here.


class PostCategory(models.Model):
    post_category = models.CharField(max_length=50)

    def __str__(self):
        return self.post_category

    class Meta:
        ordering = ['post_category']


class PostSubcategory(models.Model):
    post_category = models.ForeignKey(
        PostCategory, on_delete=models.SET_NULL, null=True)
    post_subcategory = models.CharField(max_length=50, db_index=True)

    class Meta:
        ordering = ['post_category', 'post_subcategory']

    def __str__(self):
        return self.post_subcategory


class Post(models.Model):
    title = models.CharField(max_length=300, db_index=True)
    content = RichTextUploadingField()
    preview_image_url = models.CharField(max_length=500, default='default')
    preview_text = models.CharField(max_length=300, default='default')
    post_category = models.ManyToManyField(PostCategory)
    post_subcategory = models.ManyToManyField(PostSubcategory)
    author = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        get_latest_by = ['created_at']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('post', kwargs={"post_id": self.pk})
    
    def get_post_categories_list(self):
        return ',\n'.join([post.post_category for post in self.get_post_categories()])

    def get_post_subcategories_list(self):
        return ',\n'.join([post.post_subcategory for post in self.get_post_subcategories()])

    def get_post_categories(self):
        return self.post_category.all()

    def get_post_subcategories(self):
        return self.post_subcategory.all()


class ProfileFavouritePost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True)
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['profile']


class ProfileLikedPost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True)
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['profile']


class PostComment(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    commented_post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
    


class ProfileLikedPostComment(models.Model):
    post_comment = models.ForeignKey(PostComment, on_delete=models.SET_NULL, null=True)
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['profile']
