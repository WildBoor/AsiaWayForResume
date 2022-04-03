import { getCookieByName } from '../cookie.js';
import { checkCategoryClick, getCategoryParams } from '../common.js';
import { truncateChars, truncateWords, spinner } from '../common.js';

let previousSearchParams = {};

updateOffset(document.querySelectorAll('.post_template').length);

document.querySelector('.post_categories_params').addEventListener('click', (e) => {
    checkCategoryClick(e.target);
});

document.querySelector('.posts').addEventListener('click', (e) => {
    let clickedPost = e.target.closest('.post_template');
    if (clickedPost) {
        let clickedPostId = clickedPost.dataset.postId;
        let redirectURL = window.location.origin + `/posts/post/${clickedPostId}`;
        window.location = redirectURL;
    }
});

document.querySelector('.reset').addEventListener('click', resetPostsSearchParams);

document.querySelector('.refresh').addEventListener('click', getSearchedPosts);

document.querySelector('.search').addEventListener('click', () => {
    getSearchedPosts();
});

document.querySelector('.posts').addEventListener('scroll', (e) => {
    let spinner = document.querySelector('.spinner');

    if (isEndOfScroll(e.target) && !spinner) {
        getSearchedPosts();
    } 
});


function isEndOfScroll(target) {
    let isEnd = false;
    let errorRate = 30;

    if (target.offsetHeight + target.scrollTop >= target.scrollHeight - errorRate) {
        isEnd = true;
    }
    
    return isEnd;
}

function resetPostsSearchParams() {
    let allPostsPageInputs = document.querySelectorAll('input');

    Object.keys(allPostsPageInputs).forEach((key) => {
        let input = allPostsPageInputs[key];
        let inputType = allPostsPageInputs[key].type;

        if (inputType == 'checkbox' || inputType == 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}

function getSearchFieldParams() {
    let searchFieldInput = document.querySelector('.search_field input');

    return searchFieldInput.value ? { 'search_string': searchFieldInput.value.trim() } : {};
}

export function getTimePeriodSearchParams() {
    let timePeriodBlock = document.querySelector('.time_period');
    let checkedTimePeriod = timePeriodBlock.querySelector('input:checked');
    let response = {}

    if (checkedTimePeriod) {
        response = {
            'time_period': checkedTimePeriod.id
        }
    }

    return response;
}

function getSearchedPosts() {
    let postsSearchParams = getPostsSearchParams();
    let csrfToken = getCookieByName('csrftoken');
    let postsElement = document.querySelector('.posts');
    let isEqual = compareSearchParams(previousSearchParams, postsSearchParams);
    let spinnerElement = spinner();
    let offset;
    
    if (isEqual) {
        offset = getOffset();
        spinnerElement.classList.toggle('bottom');
    } else {
        previousSearchParams = Object.assign({}, postsSearchParams);
        resetOffset();
        offset = getOffset();
        postsElement.innerHTML = '';
        spinnerElement.classList.toggle('top');
    }

    Object.assign(postsSearchParams, { offset: offset });

    postsElement.appendChild(spinnerElement);

    setTimeout(() => {
        fetch(
            'get_searched_posts/',
            {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested_with': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(postsSearchParams)
            })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                let noSearchedPostsBlock = document.querySelector('.no_searched_posts');

                if (noSearchedPostsBlock) {
                    noSearchedPostsBlock.remove();
                }

                spinnerElement.remove();

                if (response.status == 'success') {
                    let postsElement = document.querySelector('.posts');
                    let posts = response.response;
                    let postsKeys = Object.keys(posts); 

                    if (postsKeys.length) { 
                        postsKeys.forEach((key) => {
                            let newPost = new postBlock(posts[key]);
                            newPost = newPost.getFilledPostBlock();

                            postsElement.appendChild(newPost);
                        });

                        updateOffset(postsKeys.length);
                    }
                }

                if (response.status == 'no posts') {
                    if (!isEqual) {
                        let div = document.createElement('div');

                        postsElement.innerHTML = '';
                        div.setAttribute('class', 'no_searched_posts');
                        div.innerHTML = 'There is no posts for this request.';
                        postsElement.appendChild(div);

                        resetOffset();
                    }
                }

                return response;
            }).catch((error) => {
                console.log(error);
            });
    }, 1000);

}

function getPostsSearchParams() {
    let postsSearchFieldParams = getSearchFieldParams();
    let postsLeftColumnSearchParams = getCategoryParams();
    let postsTimePeriodSearchParams = getTimePeriodSearchParams();
    let postsFullSearchParams = {};

    Object.assign(
        postsFullSearchParams,
        postsSearchFieldParams,
        postsLeftColumnSearchParams,
        postsTimePeriodSearchParams
    );

    return postsFullSearchParams;
}


function getOffset() {
    return Number(document.querySelector('.posts').dataset.offset);
}


function updateOffset(step) {
    let offsetDataset = document.querySelector('.posts').dataset;
    offsetDataset.offset = +offsetDataset.offset + step;
}


function resetOffset() {
    let offsetDataset = document.querySelector('.posts').dataset;
    offsetDataset.offset = 0;
}


function postBlock(postData) {
    this.postId = postData['id'];
    this.postTitle = postData['title'];
    this.postPreviewImageUrl = postData['preview_image_url'];
    this.postPreviewText = postData['preview_text'];
    this.postCreatedAt = postData['created_at'];
    this.postAuthorId = postData['author_id'];
    this.postAuthorLogin = postData['author_login'];
    this.postAuthorAvatarUrl = postData['author_avatar_url'];
    this.postCommentsTotal = postData['comments_total'];

    this.getPostId = () => {
        return this.postId;
    };

    this.getPostTitle = () => {
        let truncatedStr = truncateChars(this.postTitle, 100);

        truncatedStr = truncateWords(truncatedStr, 7);

        return truncatedStr;
    };

    this.getPostPreviewText = () => {
        let truncatedStr = truncateChars(this.postPreviewText, 300);

        truncatedStr = truncateWords(truncatedStr, 25);

        return truncatedStr;
    };

    this.getPostPreviewImageUrl = () => {
        return this.postPreviewImageUrl;
    };

    this.getPostCreatedAt = () => {
        return this.postCreatedAt;
    };

    this.getPostAuthorId = () => {
        return this.postAuthorId;
    };

    this.getPostAuthorLogin = () => {
        return this.postAuthorLogin;
    };

    this.getPostAuthorAvatarUrl = () => {
        return window.location.origin + '/media/' + this.postAuthorAvatarUrl;
    };

    this.getPostCommentsTotal = () => {
        return this.postCommentsTotal;
    };

    // this.getPostLikesTotal = () => {
    //     return this.LikesTotal;
    // };

    this.getFilledPostBlock = () => {
        let div = document.createElement('div');
        let innerHtmlContent = '<div class="background"></div>' +
            '<div class="post_img">' +
            `<img src="${this.getPostPreviewImageUrl()}" alt="">` +
            '</div>' +
            `<div class="title">${this.getPostTitle()}</div>` +
            `<div class="content">${this.getPostPreviewText()}</div>` +
            '<div class="details">' +
            `<div class="date"><span>${this.getPostCreatedAt()}</span></div>` +
            '<div class="comments">' +
            `<span><i class='bx bx-comment'></i> ${this.getPostCommentsTotal()}</span>` +
            '</div>' +
            `<a class="author" href="profile/${this.getPostAuthorId()}/">` +
            `<img src="${this.getPostAuthorAvatarUrl()}" alt="">` +
            `<div class="name">${this.getPostAuthorLogin()}</div>` +
            '</a>' +
            '</div>';

        div.setAttribute('class', 'post_template');
        div.setAttribute('data-post-id', this.getPostId());
        div.innerHTML = innerHtmlContent;

        return div;
    };
}


function compareSearchParams(previousParams, currentParams) {
    let isEqual = true;

    if (!Object.keys(previousParams).length && !Object.keys(currentParams).length) {
        return isEqual;
    } else {
        
        Object.keys(currentParams).forEach((key) => {
            let previousParam = previousParams[key];
            let currentParam = currentParams[key];

            if (previousParam && Object.keys(previousParam).length) {
                Object.keys(currentParam).forEach((key) => {
                    let previousParamProp = previousParam[key];
                    let currentParamProp = currentParam[key];

                    if (key == 'category_id') {
                        isEqual = currentParamProp == previousParamProp;
                        
                        if (isEqual) {
                            return isEqual;
                        }  
                    }

                    if (key == 'time_period') {
                        isEqual = currentParamProp == previousParamProp;
                        if (isEqual) {
                            return isEqual;
                        }  
                    }
    
                    
                    if (key == 'is_category_checked') {
                        isEqual = currentParamProp == previousParamProp;
                        if (isEqual) {
                            return isEqual;
                        }  
                    }
    
    
                    if (key == 'subcategories') {
                        isEqual = currentParamProp.length == previousParamProp.length;
    
                        if (isEqual) {
                            for (let i; i <= previousParamProp.length; i++) {

                                if (!previousParamProp.includes(currentParamProp[i])) {
                                    isEqual = false;
                                    return isEqual;
                                }
                            }
                        } else {
                            isEqual = false;
                            return isEqual;
                        }
                    }
                });

                return isEqual;
            } else {
                isEqual = false;
                return isEqual;
            }
        });
    }

    return isEqual;
}