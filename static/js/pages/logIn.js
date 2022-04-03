import { validateForm } from '../validation/formValidation.js';
import { sendFormDataFetch } from '../common.js';

let loginMinLength = 2;
let loginMaxLength = 50;
let passwordMinLength = 8;
let passwordMaxLength = 50;

let fieldsValidationRules = {
    'username': ['required', { 'minLength': loginMinLength }, { 'maxLength': loginMaxLength }],
    'password': ['required'],
};

let fieldsValidatorsErrorMessages = {
    'username': {
        'required': 'Enter your login.',
        'minLength': `Your login is too short. Minimum length is ${loginMinLength}.`,
        'maxLength': `Your login is too long. Maximum length is ${loginMaxLength}.`,
    },
    'password': {
        'required': 'Enter your password.',
        'minLength': `Your password is too short. Minimum length is ${passwordMinLength}.`,
        'maxLength': `Your password is too long. Maximum length is ${passwordMaxLength}.`,
    },

};

let logInForm = document.querySelector('.log_in_form');

logInForm.addEventListener('submit', logInFormHandler, false);

logInForm.setAttribute('novalidate', 'novalidate');
logInForm.querySelector('input[name="username"]').setAttribute('placeholder', 'Login');
logInForm.querySelector('input[name="username"]').setAttribute('autocomplete', 'off');
logInForm.querySelector('input[name="password"]').setAttribute('placeholder', 'Password');

function logInFormHandler(e) {
    e.preventDefault();

    let formValidationResponse = validateForm(logInForm, fieldsValidationRules, fieldsValidatorsErrorMessages);

    if (formValidationResponse.isValid) {
        let logInFormData = formValidationResponse.formData;
        let redirectURL = window.location.origin;

        sendFormDataFetch(logInForm, logInFormData, 'validate_login_form', redirectURL)
    }
}