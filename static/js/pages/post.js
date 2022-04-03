import { imageModal, sendFormDataFetch } from '../common.js';
import { validateForm } from '../validation/formValidation.js';

let newCommentForm = document.querySelector('.comment_form');

if (newCommentForm) {
    let newPostCommentFromTextarea = newCommentForm.querySelector('textarea');

    newPostCommentFromTextarea.removeAttribute('cols');
    newPostCommentFromTextarea.removeAttribute('rows');

    document.querySelector('.leave_comment').addEventListener('click', newPostCommentFormHandler);
}

let commentContentMinLength = 2;
let commentContentMaxLength = 500;

let fieldsValidationRules = {
    'content': ['required', { 'minLength': commentContentMinLength }, { 'maxLength': commentContentMaxLength }],
};

let fieldsValidatorsErrorMessages = {
    'content': {
        'required': 'Comment can not be empty.',
        'minLength': `Comment is too short. Minimum length is ${commentContentMinLength}.`,
        'maxLength': `Comment is too long. Maximum length is ${commentContentMaxLength}.`,
    },
};


function newPostCommentFormHandler(e) {
    e.preventDefault();

    let formValidationResponse = validateForm(newCommentForm, fieldsValidationRules, fieldsValidatorsErrorMessages)

    console.log(formValidationResponse);
    
    if (formValidationResponse.isValid) {
        let newPostCommentData = formValidationResponse.formData;

        sendFormDataFetch(newCommentForm, newPostCommentData, 'update_post_comments')
        .then((response) => {
            let newPost = postCommentBlock(response.new_comment_data);
            let firstComment = document.querySelector('.comment');
            let parentDivNode = firstComment ? firstComment.parentNode : false;
            let postCommentsTotal = document.querySelector('.comments .total');

            if (!firstComment) {
                document.querySelector('.post_comments').appendChild(newPost);
            } else {
                parentDivNode.insertBefore(newPost, firstComment);
            }
            
            document.querySelector('textarea').value = '';
            postCommentsTotal.textContent = +postCommentsTotal.textContent + 1;
        });
    }
}

document.querySelector('.post').addEventListener('click', (e) => {
    let postImageClicked = e.target.closest('.content img');

    if (postImageClicked) {
        let imageSrc = e.target.src;
        document.body.appendChild(imageModal(imageSrc));
    }
});

document.body.addEventListener('click', (e) => {
    if (e.target.closest('.image_modal')) {
        e.target.closest('.image_modal').remove();
    }
});


function postCommentBlock(commentData) {
    let div = document.createElement('div');

    div.classList.toggle('comment');
    div.innerHTML = '<div class="background"></div>' +
                    '<div class="details">' +
                        `<a class="author" href="${commentData['author_url']}">` +
                            `<img src="${commentData['author_avatar_url']}" alt="">` +
                            `<div class="name">${commentData['author_login']}</div>` + 
                        '</a>' +
                        `<div class="date">${commentData['created_at']}</div>` +
                    '</div>' +
                    `<div class="content">${commentData['content']}</div>` +
                    '<div class="options">' +
                        '<i class="bx bx-dislike"></i>' +
                        '<i class="bx bx-like"></i>' +
                        '<i class="bx bx-reply bx-flip-horizontal"></i>' +
                        '<i class="bx bx-message-square-detail"></i>' +
                    '</div>';
                    
    return div;
}
