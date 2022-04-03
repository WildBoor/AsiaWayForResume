import { validateForm } from '../validation/formValidation.js';
import { sendFormDataFetch } from '../common.js';

let loginMinLength = 2;
let loginMaxLength = 50;
let passwordMinLength = 8;
let passwordMaxLength = 50;

let fieldsValidationRules = {
    'username': ['required', { 'minLength': loginMinLength }, { 'maxLength': loginMaxLength }],
    'email': ['required', 'isEmail'],
    'gender': ['required'],
    'password1': ['required', { 'minLength': passwordMinLength }, { 'maxLength': passwordMaxLength }],
    'password2': ['required', { 'maxLength': passwordMaxLength }, 'isPasswordRepeated'],
};

let fieldsValidatorsErrorMessages = {
    'username': {
        'required': 'Enter your login.',
        'minLength': `Your login is too short. Minimum length is ${loginMinLength}.`,
        'maxLength': `Your login is too long. Maximum length is ${loginMaxLength}.`,
    },
    'email': {
        'required': 'Enter your email.',
        'isEmail': 'This is not email.',
    },
    'gender': {
        'required': 'What\'s your gender?'
    },
    'password1': {
        'required': 'Enter your password.',
        'minLength': `Your password is too short. Minimum length is ${passwordMinLength}.`,
        'maxLength': `Your password is too long. Maximum length is ${passwordMaxLength}.`,
    },
    'password2': {
        'required': 'Repeat your password.',
        'maxLength': 'Your repeated password is too long.',
        'isPasswordRepeated': 'Password is not repeated.'
    }
};

let signUpForm = document.querySelector('.sign_up_form');

signUpForm.addEventListener('submit', signUpFormHandler, false);

signUpForm.setAttribute('novalidate', 'novalidate');
signUpForm.querySelector('input[name="username"]').setAttribute('autocomplete', 'off');
signUpForm.querySelector('input[name="email"]').setAttribute('autocomplete', 'off');
signUpForm.querySelector('input[name="password1"]').setAttribute('placeholder', 'Password');
signUpForm.querySelector('input[name="password2"]').setAttribute('placeholder', 'Repeat password');

function signUpFormHandler(e) {
    e.preventDefault();

    let formValidationResponse = validateForm(signUpForm, fieldsValidationRules, fieldsValidatorsErrorMessages);

    if (formValidationResponse.isValid) {
        let signUpFormData = formValidationResponse.formData;
        let redirectURL = window.location.origin;

        sendFormDataFetch(signUpForm, signUpFormData, 'validate_signup_form', redirectURL)
    }
}
