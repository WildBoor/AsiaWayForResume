from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import json

from config import settings
from user.user_forms import *
from user.models import Profile, ProfileAvatarImage

# Create your views here.


def index(request):
    return render(request, "pages/index.html", {})


def log_in(request):

    user_login_form = UserLogInFrom()

    return render(request, "pages/logIn.html", {'user_login_form': user_login_form})


def validate_login_form(request):
    if request.method == 'POST':
        requestBodyData = json.loads(request.body)

        log_in_form = UserLogInFrom(data=requestBodyData)

        if log_in_form.is_valid():
            user = authenticate(
                username=log_in_form.cleaned_data['username'],
                password=log_in_form.cleaned_data['password'],
            )

            if user is not None:
                login(request, user)

                return JsonResponse({'status': 'success'})
            else:
                errorMessage = {'post_subcategory': [
                    {'message': 'Login or password is wrong.'}]}

                return JsonResponse({
                    'errors': json.dumps(errorMessage),
                    'status': 'error'
                })

        else:
            user_log_in_form_errors = log_in_form.errors.as_json()
            print(user_log_in_form_errors)
            return JsonResponse({'errors': user_log_in_form_errors, 'status': 'error'})


def sign_up(request):
    user_signup_form = UserSignUpForm()
    profile_signup_form = ProfileSignUpForm()

    return render(request, "pages/signUp.html", {
        'user_signup_form': user_signup_form,
        'profile_signup_form': profile_signup_form,
    })


def validate_signup_form(request):
    if request.method == 'POST':
        requestBodyData = json.loads(request.body)
        userRequestData = {
            'username': requestBodyData['username'],
            'email': requestBodyData['email'],
            'password1': requestBodyData['password1'],
            'password2': requestBodyData['password2'],
        }
        profileRequestData = {
            'gender': requestBodyData['gender'],
        }

        user_signup_form = UserSignUpForm(userRequestData)
        profile_signup_form = ProfileSignUpForm(profileRequestData)

        if user_signup_form.is_valid() and profile_signup_form.is_valid():
            user_signup_form.save()

            createdUser = authenticate(
                username=user_signup_form.cleaned_data['username'],
                password=user_signup_form.cleaned_data['password1'],
            )

            if createdUser:
                profile = Profile(
                    user=createdUser, 
                    gender=profile_signup_form.cleaned_data['gender']
                    )
                profile.save()

                profile_avatar_image = ProfileAvatarImage(profile=profile)
                profile_avatar_image.save()

                login(request, createdUser)

            return JsonResponse({'status': 'success', 'successMessage': 'Success!'})
        else:
            userFomErrors = user_signup_form.errors.as_json()
            profileFormErrors = profile_signup_form.errors.as_json()

            if (len(userFomErrors) > 2) and (len(profileFormErrors) <= 2):
                userProfileFormsErrors = userFomErrors
            elif (len(userFomErrors) <= 2) and (len(profileFormErrors) > 2):
                userProfileFormsErrors = profileFormErrors
            else:
                userProfileFormsErrors = userFomErrors[:-1] + ',' + profileFormErrors[1:]

            return JsonResponse({'errors': userProfileFormsErrors, 'status': 'error'})


@login_required
def log_out(request):
    logout(request)

    return redirect('index')


def community(request):
    return render(request, "pages/community.html", {})


def about(request):
    context = {
        'BASE_DIR': settings.BASE_DIR,
        'TEMPLATE_DIR': settings.TEMPLATE_DIR,
    }
    return render(request, "pages/about.html", context)
