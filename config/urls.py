"""voiceup URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from . import settings

from asia_way.views import *
from static.ckeditor_uploader import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor/upload/', login_required(views.upload), name='ckeditor_upload'),
    path('ckeditor/browse/', never_cache(login_required(views.browse)), name='ckeditor_browse'),
    path('', index, name="index"),
    path('login/', log_in, name="log_in"),
    path('login/validate_login_form/', validate_login_form, name="validate_login_form"),
    path('logout/', log_out, name="log_out"),
    path('signup/', sign_up, name="sign_up"),
    path('signup/validate_signup_form/', validate_signup_form, name="validate_signup_form"),
    path('community/', community, name="community"),
    path('about/', about, name="about"),
    path('user/', include('user.urls')),
    path('posts/', include('posts.urls')),
    path('courses/', include('courses.urls')),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
