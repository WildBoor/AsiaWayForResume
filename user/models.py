from django.db import models
from django.urls import reverse
from django.contrib import admin
from django.contrib.auth.models import User


PROFILE_GENDER = [
    ('M', 'Male'),
    ('FM', 'Female'),
]


class ProfileSocialUrl(models.Model):
    twitter_account_url = models.URLField(max_length=100, blank=True)
    vk_account_url = models.URLField(max_length=100, blank=True)
    facebook_account_url = models.URLField(max_length=100, blank=True)
    youtube_account_url = models.URLField(max_length=100, blank=True)
    tik_tok_account_url = models.URLField(max_length=100, blank=True)
    telegram_account_url = models.URLField(max_length=100, blank=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gender = models.CharField(max_length=2, choices=PROFILE_GENDER, default=PROFILE_GENDER[0])
    birth_date = models.DateField(db_index=True, null=True)
    social_links = models.OneToOneField(ProfileSocialUrl, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.user.username
    
    def get_absolute_url(self):
        return reverse('user', kwargs={"profile_id": self.pk})


def get_avatar_image_upload_to(instance, filename):
        return 'users_avatar/{}/{}'.format(instance.id, filename)

class ProfileAvatarImage(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    avatar_image_url = models.ImageField(upload_to=get_avatar_image_upload_to, default='default_user_avatar.jpg')


class ProfileFriend(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    friends = models.JSONField()

    def __str__(self):
        return self.profile.user.username


class ProfileFriendAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'profile',
        'friends'
    ]


class Notification(models.Model):
    title = models.CharField(max_length=100, db_index=True)
    content = models.TextField()
    author = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    def __str__(self):
        return self.title
