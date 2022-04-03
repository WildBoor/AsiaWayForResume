from django.contrib import admin

from user.models import *
from posts.models import *
from courses.models import *
from chats.models import *
from services import posts_services
# Register your models here.

# user models
class ProfileSocialUrlAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'profile',
        'twitter_account_url',
        'vk_account_url',
        'facebook_account_url',
        'youtube_account_url',
        'tik_tok_account_url',
        'telegram_account_url',
    ]


class ProfileAvatarImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'avatar_image_url']


class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'gender',
        'birth_date'
    ]
    list_display_links = ['user']


class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'title',
        'content',
        'author',
        'created_at',
        'updated_at'
    ]
    search_fields = [
        'title',
        'author',
        'created_at',
        'updated_at'
    ]


# admin.site.register(ProfileAccessPermission, ProfileAccessPermissionAdmin)
admin.site.register(ProfileAvatarImage, ProfileAvatarImageAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(ProfileFriend, ProfileFriendAdmin)
admin.site.register(ProfileSocialUrl, ProfileSocialUrlAdmin)
admin.site.register(Notification, NotificationAdmin)


# posts models
class PostCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'post_category']
    search_fields = ['post_category']
    list_display_links = ['post_category']


class PostSubcategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'post_category', 'post_subcategory']
    search_fields = ['post_category', 'post_subcategory']
    list_display_links = ['post_category', 'post_subcategory']


class PostAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'title',
        # 'content',
        'author',
        # 'preview_image_url',
        # 'preview_text',
        'get_post_categories_list',
        'get_post_subcategories_list',
        'created_at',
        'updated_at'
    ]
    list_display_links = ['title', 'author']



class ProfileFavouritePostAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'profile', 'date']
    search_fields = ['post', 'profile', 'date']


class ProfileLikedPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'profile', 'date']
    search_fields = ['post', 'profile', 'date']


class PostCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'content', 'commented_post', 'created_at']
    list_display_links = ['author']
    search_fields = ['author', 'commented_post', 'created_at']


class ProfileLikedPostCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'post_comment', 'profile', 'date']
    search_fields = ['post_comment', 'profile', 'date']


admin.site.register(PostCategory, PostCategoryAdmin)
admin.site.register(PostSubcategory, PostSubcategoryAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(ProfileFavouritePost, ProfileFavouritePostAdmin)
admin.site.register(ProfileLikedPost, ProfileLikedPostAdmin)
admin.site.register(PostComment, PostCommentAdmin)
admin.site.register(ProfileLikedPostComment, ProfileLikedPostCommentAdmin)

# courses models


class CourseAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'title',
        'content',
        'author',
        'price',
        'created_at',
        'updated_at',
    ]
    search_fields = [
        'id',
        'title',
        'author',
        'price',
        'created_at',
        'updated_at',
    ]


class UserCourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'course', 'user', 'pay_date']
    search_fields = ['course', 'user', 'pay_date']


admin.site.register(Course, CourseAdmin)
admin.site.register(UserCourse, UserCourseAdmin)

# chats models


class ChatAdmin(admin.ModelAdmin):
    list_ordering = ['id', 'user', 'chat_members']
    search_fields = ['user']


admin.site.register(Chat, ChatAdmin)
