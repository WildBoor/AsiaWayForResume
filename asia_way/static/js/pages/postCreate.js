import { checkCategoryClick, sendFormDataFetch } from '../common.js';
import { validateForm } from '../validation/formValidation.js';

// let id = setInterval(() => {
//     if (CKEDITOR) {
//         CKEDITOR.instances.id_content.resize('90%','600');
//     }
//     console.log('1');

//     if (CKEDITOR) {
//         clearInterval(id);
//     }
// }, 500);


let titleMinLength = 2;
let titleMaxLength = 300;

let fieldsValidationRules = {
    'title': ['required', { 'minLength': titleMinLength }, { 'maxLength': titleMaxLength }],
    'content': ['required'],
    'post_subcategory': ['required'],
    'preview_image_url': ['required'],
    'preview_text': ['required'],
};

let fieldsValidatorsErrorMessages = {
    'title': {
        'required': 'Enter your new post title.',
        'minLength': `Your new post title is too short. Minimum length is ${titleMinLength}.`,
        'maxLength': `Your new post title is too long. Maximum length is ${titleMaxLength}.`,
    },
    'content': {
        'required': 'Your new post content is empty.',
    },
    'post_subcategory': {
        'required': 'Choose categories for your post.',
    },
    'preview_image_url': {
        'required': 'There is no images in your post.',
    },
    'preview_text': {
        'required': 'Something went wrong with preview text.',
    },
};

let newPostForm = document.querySelector('.post_create_form');

newPostForm.setAttribute('novalidate', 'novalidate');

document.querySelector('.post_categories_params').addEventListener('click', (e) => {
    checkCategoryClick(e.target);
});

document.querySelector('.submit').addEventListener('click', newPostFormHandler);


function newPostFormHandler(e) {
    e.preventDefault();

    let formValidationResponse = validateForm(newPostForm, fieldsValidationRules, fieldsValidatorsErrorMessages)

    if (formValidationResponse.isValid) {
        let newPostData = formValidationResponse.formData;

        sendFormDataFetch(newPostForm, newPostData, 'create_new_post');
    }
}

// function NewPost() {
//     this.title = document.querySelector('.title').value;
//     this.content = CKEDITOR.instances.id_content.getData();
//     this.errors = {};

//     this.getTitle = () => {
//         return this.title;
//     };

//     this.getContent = () => {
//         return this.content;
//     };

//     this.isValid = () => {
//         let isValid = this.getTitle() && this.getContent();

//         if (!this.getTitle()) {

//         }

//         return Boolean(this.getTitle() && this.getContent());
//     };

//     this.getFullData = () => {
//         return {
//             title: this.getTitle(),
//             content: this.getContent(),
//         };
//     };
// }