import { notificationMessage, hideNotificationBlock } from '../notification.js';
import { getCategoryParams } from '../common.js';

let validatorsNamesMap = {
    'required': isBlank,
    'minLength': isMoreThenMinLength,
    'maxLength': isLessOrEqualMaxLength,
    'isEmail': isEmail,
    'isPasswordRepeated': isPasswordRepeated,
};

export function validateForm(form, fieldsValidationRules, fieldsValidatorsErrorMessages) {
    let validatingFieldsNames = Object.keys(fieldsValidationRules);
    let formData = getFormData(form, validatingFieldsNames);

    let errors = getFormErrors(formData, fieldsValidationRules, fieldsValidatorsErrorMessages);
    let isFormValid = !Object.keys(errors).length;
    let formValidationResponse = {
        isValid: isFormValid,
        formData: ''
    };

    if (isFormValid) {
        formValidationResponse.formData = formData;
    } else {
        showErrors(form, errors);
    }

    return formValidationResponse;
}

function getFormData(form, validatingFieldsNames) {

    let formInputs = form.querySelectorAll('input');
    let formTextareas = form.querySelectorAll('textarea');
    let isFormPostCategories = document.querySelector('.post_create_form');
    let formData = {};

    if (formInputs) {
        formInputs.forEach((inputElement) => {
            let inputElementName = inputElement.name;

            if (validatingFieldsNames.includes(inputElementName)) {
                if (inputElementName == 'gender') {
                    if (inputElement.checked) {
                        formData[inputElementName] = inputElement.value;
                    }
                } else {
                    formData[inputElementName] = inputElement.value;
                }
            }
        });
    }

    if (formTextareas) {
        formTextareas.forEach((textarea) => {
            let isCkeditorTextarea = textarea.closest('.django-ckeditor-widget');

            if (isCkeditorTextarea) {
                let ckeditor = CKEDITOR.instances[`id_${textarea.name}`];
                let ckeditorData = ckeditor.getData();

                formData[textarea.name] = ckeditorData;

                if (ckeditorData.length) {
                    let truncate = 200;
                    let textForPreview = ckeditor.document.getBody().getText().trim().slice(0, truncate);
                    let imageUrlForPreview = ckeditor.document.findOne('img');

                    if (imageUrlForPreview) {
                        formData['preview_image_url'] = imageUrlForPreview.getAttribute('src');
                    } else {
                        formData['preview_image_url'] = '';
                    }

                    formData['preview_text'] = textForPreview;
                }
            } else {
                formData[textarea.name] = textarea.value;
            }
        });
    }

    if (isFormPostCategories) {
        Object.assign(formData, { post_subcategory: getCategoryParams() });
    }

    // if (!formData['gender']) {
    //     formData['gender'] = '';
    // }

    return formData;
}

function getFormErrors(formData, fieldsValidationRules, fieldsValidatorsErrorMessages) {

    let formFieldsNames = Object.keys(formData);
    let errors = {};

    formFieldsNames.forEach((fieldName) => {

        fieldsValidationRules[fieldName].forEach((validationRule) => {
            let isValidationRuleObject = (typeof validationRule == 'object');
            let validationRuleName = isValidationRuleObject ? Object.keys(validationRule)[0] : validationRule;
            let validatorFunction = isValidationRuleObject ? validatorsNamesMap[validationRuleName] : validatorsNamesMap[validationRule];
            let isFieldValid = true;

            if (isValidationRuleObject) {
                if (validationRuleName == 'maxLength' || validationRuleName == 'minLength') {
                    isFieldValid = validatorFunction(formData[fieldName], validationRule[validationRuleName]);
                }
            } else {
                if (validationRuleName == 'isPasswordRepeated') {
                    let password = formData['password'];

                    if (password) {
                        isFieldValid = validatorFunction(password, formData[fieldName]);
                    }
                } else {
                    isFieldValid = validatorFunction(formData[fieldName]);
                }
            }

            if (!isFieldValid) {
                let errorFieldValidatorMessage = fieldsValidatorsErrorMessages[fieldName][validationRuleName];

                if (!errors[fieldName]) {
                    errors[fieldName] = [];
                }

                if (!errorFieldValidatorMessage) {
                    console.log(`There is no error message for validator '${validationRuleName}' for '${fieldName}' field`);
                }

                errors[fieldName].push(errorFieldValidatorMessage);
            }
        });
    });

    // console.log(errors);


    return errors;
}

export function showErrors(form, errors) {
    hideNotificationBlock(500);

    setTimeout(() => {
        let previousErrors = form.querySelectorAll('.error_field');

        if (previousErrors) {
            Object.keys(previousErrors).forEach((key) => {
                previousErrors[key].classList.toggle('error_field');
            });
        }

        let errorsFieldsNames = Object.keys(errors);
        let errorsBlock = document.createElement('div');

        errorsBlock.setAttribute('class', 'notification_block');
        document.body.appendChild(errorsBlock);

        errorsFieldsNames.forEach((fieldName) => {
            let errorMessage = new notificationMessage();
            let firstErrorMessage;
            let isInput = form.querySelector(`input[name="${fieldName}"]`);
            let isTextarea = form.querySelector(`textarea[name="${fieldName}"]`);
            // let isPostSubcategories = document.querySelector('.post_subcategory');

            if (isInput) {
                form.querySelector(`input[name="${fieldName}"]`).classList.toggle('error_field');
            }

            if (isTextarea) {
                form.querySelector(`textarea[name="${fieldName}"]`).classList.toggle('error_field');
            }

            if (!errors[fieldName][0]['message']) {
                firstErrorMessage = errors[fieldName][0];
            } else {
                firstErrorMessage = errors[fieldName][0]['message'];
            }

            errorMessage.setMessage(firstErrorMessage);
            errorMessage.setStatus('error');
            errorsBlock.appendChild(errorMessage.getMessageElement());
        });
    }, 500);
}

function isBlank(inputValue) {
    if (typeof inputValue == 'object') {
        return Object.keys(inputValue).length;
    } else {
        return Boolean(inputValue);
    }
}

function isMoreThenMinLength(inputValue, min_length) {
    return inputValue.length >= min_length;
}

function isLessOrEqualMaxLength(inputValue, max_length) {
    return inputValue.length <= max_length;
}

function isEmail(email) {
    let regEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return Boolean(email.match(regEx));
}

function isPasswordRepeated(password, repeatedPassword) {
    return password === repeatedPassword;
}