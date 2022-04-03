import { getCookieByName } from './cookie.js';
import { notificationMessage, hideNotificationBlock } from './notification.js';
import { showErrors } from './validation/formValidation.js';

export function checkCategoryClick(target) {
    let subcategoryUl = target.closest('ul.subcategory');

    if (target.tagName !== 'INPUT') {
        let category = target.closest('.category');
        let previousClickedCategory = document.querySelector('.category.show');

        if (category) {
            let nextElement = category.nextElementSibling;
            let subcategoriesUl = nextElement && nextElement.tagName == 'UL' ? nextElement : false;

            if (subcategoriesUl) {

                if (previousClickedCategory) {
                    let previousShownSubcategories = previousClickedCategory.nextElementSibling;

                    previousClickedCategory.classList.toggle('show');
                    previousShownSubcategories.classList.toggle('show');
                }

                if (category !== previousClickedCategory) {
                    category.classList.toggle('show');
                    subcategoriesUl.classList.toggle('show');
                }

            }

        }
    }

    if (target.tagName == 'INPUT' && target.closest('.category')) {
        let targetCategoryInput = target;
        let subcategoryUl = targetCategoryInput.closest('.category').nextElementSibling;
        let subcategoryInputs = subcategoryUl ? subcategoryUl.querySelectorAll('input') : false;
        let category = subcategoryUl.previousElementSibling.querySelector('input');
        let isAsiaCategory = category.name == 'Asia';

        if (target.nextElementSibling && subcategoryInputs) {
            if (subcategoryInputs && target.nextElementSibling.tagName !== 'LABEL') {
                if (targetCategoryInput.checked) {
                    Object.keys(subcategoryInputs).forEach((key) => {
                        subcategoryInputs[key].checked = true;
                    });
                } else {
                    Object.keys(subcategoryInputs).forEach((key) => {
                        subcategoryInputs[key].checked = false;
                    });
                }
            }
        }

        if (targetCategoryInput.name == 'World') {
            let asiaCategoryInput = document.querySelector('#Asia');
            let asiaCategoryBlock = asiaCategoryInput.closest('.category');
            let asiaSubcategoriesInputs = asiaCategoryBlock.nextElementSibling.querySelectorAll('input');

            asiaCategoryInput.checked = false;

            Object.keys(asiaSubcategoriesInputs).forEach((key) => {
                asiaSubcategoriesInputs[key].checked = false;
            });
        }

        if (isAsiaCategory) {
            let worldCategoryInput = document.querySelector('#World');
            worldCategoryInput.checked = false;
        }
    }

    if (subcategoryUl) {
        let allInputsChecked = true;
        let subcategoryInputs = subcategoryUl.querySelectorAll('input');
        let category = subcategoryUl.previousElementSibling.querySelector('input');
        let isAsiaCategory = category.name == 'Asia';

        Object.keys(subcategoryInputs).forEach((key) => {

            allInputsChecked = subcategoryInputs[key].checked && allInputsChecked;

        });

        if (allInputsChecked) {
            category.checked = true;
        } else {
            category.checked = false;
        }

        if (isAsiaCategory) {
            let worldCategoryInput = document.querySelector('#World');
            worldCategoryInput.checked = false;
        }
    }
}


export function sendFormDataFetch(form, data, sendURL, redirectURL = null) {
    let csrfToken = getCookieByName('csrftoken');
    let fetchResponse = {};

    fetchResponse = fetch(
        `${sendURL}/`,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested_with': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {

            if (response.status == 'success') {
                hideNotificationBlock(500);

                if (response.success_message) {
                    let notificationBlock = document.createElement('div');
                    let successMessage = new notificationMessage();

                    successMessage.setStatus(response.status);
                    successMessage.setMessage(response.success_message);

                    notificationBlock.setAttribute('class', 'notification_block');

                    notificationBlock.appendChild(successMessage.getMessageElement());
                    document.body.appendChild(notificationBlock);
                }

                if (redirectURL) {
                    setTimeout(() => {
                        window.location = redirectURL;
                    }, 500);
                }

                if (response.redirect_url) {
                    setTimeout(() => {
                        window.location = response.redirect_url;
                    }, 500);
                }
            }

            if (response.status == 'error') {
                console.log(response.errors);
                console.log(JSON.parse(response.errors));

                showErrors(form, JSON.parse(response.errors));
            }

            return response;
        }).catch((error) => {
            console.log(error);
        });


    return fetchResponse;
}

export function getCategoryParams() {
    let categoriesBlock = document.querySelector('.post_categories_params');
    let categoryParams = {};

    if (categoriesBlock) {
        let categoriesInputs = categoriesBlock.querySelectorAll('input');

        Object.keys(categoriesInputs).forEach((key) => {
            let categoryBlock = categoriesInputs[key].closest('.category');

            if (categoryBlock) {
                let categoryInput = categoryBlock.querySelector('input')
                let categoryName = categoryInput.name;

                categoryParams[categoryName] = {};
                categoryParams[categoryName]['category_id'] = categoryInput.dataset.categoryId;
                categoryParams[categoryName]['is_category_checked'] = categoryInput.checked;
                categoryParams[categoryName]['subcategories'] = [];
            }
        });

        if (categoryParams) {
            Object.keys(categoryParams).forEach((categoryName) => {
                let categoryInput = categoriesBlock.querySelector(`input[name="${categoryName}"]`);
                let subcategoriesUl = categoriesBlock.querySelector(`ul.${categoryName}`);

                if (subcategoriesUl) {
                    let subcategoriesInputs = subcategoriesUl.querySelectorAll('input');

                    Object.keys(subcategoriesInputs).forEach((key) => {
                        let subcategoryInput = subcategoriesInputs[key];

                        if (subcategoryInput.checked) {
                            categoryParams[categoryName]['subcategories'].push(subcategoryInput.dataset.subcategoryId);
                        }
                    });
                }

                if (!categoryParams[categoryName]['subcategories'].length && !categoryInput.checked) {
                    delete categoryParams[categoryName];
                }

            });
        }
    }

    return categoryParams;
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('message_btn_close')) {
        let targetErrorElement = e.target.closest('.modal_message');

        targetErrorElement.classList.toggle('hide');

        setTimeout(() => {
            targetErrorElement.remove();
        }, 400)
    }
});


export function truncateChars(str, charTotal) {
    let isSuccess = true;

    if (str) {
        if (typeof str == 'string') {
            if (charTotal) {
                return str.trim().slice(0, charTotal);
            } else {
                isSuccess = false;
                console.log('There is no chars amount to truncatechars.');
            }
        } else {
            isSuccess = false;
            console.log('Not string was given to truncatechars.');
        }
    } else {
        isSuccess = false;
        console.log('There is no string to truncatechars.');
    }

    return isSuccess;
}

export function truncateWords(str, wordsTotal) {
    let isSuccess = true;

    if (str) {
        if (typeof str == 'string') {
            if (wordsTotal) {
                let words = str.trim().split(' ');
                let truncatedStr = '';

                for (let i = 0; i <= wordsTotal; i++) {
                    truncatedStr += ' ' + words[i];
                }

                return truncatedStr.trim() + '...';
            } else {
                isSuccess = false;
                console.log('There is no words amount to truncatewords.');
            }
        } else {
            isSuccess = false;
            console.log('Not string was given to truncatewords.');
        }
    } else {
        isSuccess = false;
        console.log('There is no string to truncatewords.');
    }

    return isSuccess;
}

export function spinner() {
    let div = document.createElement('div');

    div.setAttribute('class', 'spinner');

    div.innerHTML = '<div class="loading-container">' +
        '<div class="ball"></div>' +
        '<div class="ball-inner"></div>' +
        '</div>' +
        '<p class="ball-text">Loading</p>';

    return div;
}


export function imageModal(imageSrc) {
    let div = document.createElement('div');

    div.setAttribute('class', 'image_modal');

    div.innerHTML = `<img src="${imageSrc}">` +
        '<div class="background"></div>' +
        '<i class="close btn bx bx-x" ></i>';

    return div;
}