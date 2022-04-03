from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from user.models import Profile


class UserSignUpForm(UserCreationForm):
    class Meta:
        model = User

        fields = ['username', 'email', 'password1', 'password2']

        widgets = {
            'username': forms.TextInput(
                attrs={
                    'class': 'username',
                    'placeholder': 'Login',
                }),
            'email': forms.TextInput(
                attrs={
                    'class': 'email',
                    'placeholder': 'Email'
                }),
            'password1': forms.PasswordInput(
                attrs={
                    'class': 'password1',
                    'placeholder': 'Password'
                }),
            'password2': forms.PasswordInput(
                attrs={
                    'class': 'password2',
                    'placeholder': 'Repeat password'
                }),
        }

        error_messages = {
            'username': {
                'unique': 'User with this login already exists.',
                'required': 'Please, enter your login',
                'max_length': 'Login is too long',
            },
            'email': {
                'invalid': 'Please, enter valid email.'
            },
            'password1': {
                'required': 'Please, enter your password',
                'max_length': 'Password is too long',
            },
            'password2': {
                # 'required': 'Please, enter your password',
                'max_length': 'Password is too long',
            }
        }


class ProfileSignUpForm(forms.ModelForm):
    class Meta:
        model = Profile

        fields = ['gender']

        widgets = {
            'gender': forms.RadioSelect(
                attrs={
                    'class': 'gender',
                    'placeholder': 'Gender'
                }),

        }

        error_messages = {
            'gender': {
                'required': 'Please enter your gender.'
            },
        }


class UserLogInFrom(AuthenticationForm):
    class Meta:
        model = User

        fields = ['username', 'password']

        widgets = {
            'username': forms.TextInput(
                attrs={
                    'class': 'username',
                    'placeholder': 'Login',
                }),
            'password': forms.PasswordInput(
                attrs={
                    'class': 'password',
                    'placeholder': 'Password'
                }),
        }

        error_messages = {
            'username': {
                'unique': 'User with this login already exists.',
                'required': 'Please, enter your login',
                'max_length': 'Login is too long',
            },
            'password': {
                'required': 'Please, enter your password',
                'max_length': 'Password is too long',
            },

        }
