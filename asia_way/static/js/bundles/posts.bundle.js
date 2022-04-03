(()=>{"use strict";function e(e,t){let s=!0;if(e)if("string"==typeof e){if(t)return e.trim().slice(0,t);s=!1,console.log("There is no chars amount to truncatechars.")}else s=!1,console.log("Not string was given to truncatechars.");else s=!1,console.log("There is no string to truncatechars.");return s}function t(e,t){let s=!0;if(e)if("string"==typeof e){if(t){let s=e.trim().split(" "),o="";for(let e=0;e<=t;e++)o+=" "+s[e];return o.trim()+"..."}s=!1,console.log("There is no words amount to truncatewords.")}else s=!1,console.log("Not string was given to truncatewords.");else s=!1,console.log("There is no string to truncatewords.");return s}document.addEventListener("click",(e=>{if(e.target.classList.contains("message_btn_close")){let t=e.target.closest(".modal_message");t.classList.toggle("hide"),setTimeout((()=>{t.remove()}),400)}}));let s={};function o(){let e,t=function(){let e=function(){let e=document.querySelector(".search_field input");return e.value?{search_string:e.value.trim()}:{}}(),t=function(){let e=document.querySelector(".post_categories_params"),t={};if(e){let s=e.querySelectorAll("input");Object.keys(s).forEach((e=>{let o=s[e].closest(".category");if(o){let e=o.querySelector("input"),s=e.name;t[s]={},t[s].category_id=e.dataset.categoryId,t[s].is_category_checked=e.checked,t[s].subcategories=[]}})),t&&Object.keys(t).forEach((s=>{let o=e.querySelector(`input[name="${s}"]`),r=e.querySelector(`ul.${s}`);if(r){let e=r.querySelectorAll("input");Object.keys(e).forEach((o=>{let r=e[o];r.checked&&t[s].subcategories.push(r.dataset.subcategoryId)}))}t[s].subcategories.length||o.checked||delete t[s]}))}return t}(),s=function(){let e=document.querySelector(".time_period").querySelector("input:checked"),t={};return e&&(t={time_period:e.id}),t}(),o={};return Object.assign(o,e,t,s),o}(),o=(d="csrftoken",function(){let e=document.cookie,t={};return e&&""!==e&&(t=e.split(";").map((e=>e.split("="))).reduce(((e,t)=>{let s=t[0].trim(),o=t[1];return e[s]={},e[s]=o,e}),t)),t}()[d]),n=document.querySelector(".posts"),a=function(e,t){let s=!0;return Object.keys(e).length||Object.keys(t).length?(Object.keys(t).forEach((o=>{let r=e[o],i=t[o];return r&&Object.keys(r).length?(Object.keys(i).forEach((e=>{let t=r[e],o=i[e];if("category_id"==e&&(s=o==t,s))return s;if("time_period"==e&&(s=o==t,s))return s;if("is_category_checked"==e&&(s=o==t,s))return s;if("subcategories"==e){if(s=o.length==t.length,!s)return s=!1,s;for(let e;e<=t.length;e++)if(!t.includes(o[e]))return s=!1,s}})),s):(s=!1,s)})),s):s}(s,t),u=function(){let e=document.createElement("div");return e.setAttribute("class","spinner"),e.innerHTML='<div class="loading-container"><div class="ball"></div><div class="ball-inner"></div></div><p class="ball-text">Loading</p>',e}();var d;a?(e=r(),u.classList.toggle("bottom")):(s=Object.assign({},t),c(),e=r(),n.innerHTML="",u.classList.toggle("top")),Object.assign(t,{offset:e}),n.appendChild(u),setTimeout((()=>{fetch("get_searched_posts/",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","X-Requested_with":"XMLHttpRequest","X-CSRFToken":o},body:JSON.stringify(t)}).then((e=>e.json())).then((e=>{let t=document.querySelector(".no_searched_posts");if(t&&t.remove(),u.remove(),"success"==e.status){let t=document.querySelector(".posts"),s=e.response,o=Object.keys(s);o.length&&(o.forEach((e=>{let o=new l(s[e]);o=o.getFilledPostBlock(),t.appendChild(o)})),i(o.length))}if("no posts"==e.status&&!a){let e=document.createElement("div");n.innerHTML="",e.setAttribute("class","no_searched_posts"),e.innerHTML="There is no posts for this request.",n.appendChild(e),c()}return e})).catch((e=>{console.log(e)}))}),1e3)}function r(){return Number(document.querySelector(".posts").dataset.offset)}function i(e){let t=document.querySelector(".posts").dataset;t.offset=+t.offset+e}function c(){document.querySelector(".posts").dataset.offset=0}function l(s){this.postId=s.id,this.postTitle=s.title,this.postPreviewImageUrl=s.preview_image_url,this.postPreviewText=s.preview_text,this.postCreatedAt=s.created_at,this.postAuthorId=s.author_id,this.postAuthorLogin=s.author_login,this.postAuthorAvatarUrl=s.author_avatar_url,this.postCommentsTotal=s.comments_total,this.getPostId=()=>this.postId,this.getPostTitle=()=>{let s=e(this.postTitle,100);return s=t(s,7),s},this.getPostPreviewText=()=>{let s=e(this.postPreviewText,300);return s=t(s,25),s},this.getPostPreviewImageUrl=()=>this.postPreviewImageUrl,this.getPostCreatedAt=()=>this.postCreatedAt,this.getPostAuthorId=()=>this.postAuthorId,this.getPostAuthorLogin=()=>this.postAuthorLogin,this.getPostAuthorAvatarUrl=()=>window.location.origin+"/media/"+this.postAuthorAvatarUrl,this.getPostCommentsTotal=()=>this.postCommentsTotal,this.getFilledPostBlock=()=>{let e=document.createElement("div"),t=`<div class="background"></div><div class="post_img"><img src="${this.getPostPreviewImageUrl()}" alt=""></div><div class="title">${this.getPostTitle()}</div><div class="content">${this.getPostPreviewText()}</div><div class="details"><div class="date"><span>${this.getPostCreatedAt()}</span></div><div class="comments"><span><i class='bx bx-comment'></i> ${this.getPostCommentsTotal()}</span></div><a class="author" href="profile/${this.getPostAuthorId()}/"><img src="${this.getPostAuthorAvatarUrl()}" alt=""><div class="name">${this.getPostAuthorLogin()}</div></a></div>`;return e.setAttribute("class","post_template"),e.setAttribute("data-post-id",this.getPostId()),e.innerHTML=t,e}}i(document.querySelectorAll(".post_template").length),document.querySelector(".post_categories_params").addEventListener("click",(e=>{!function(e){let t=e.closest("ul.subcategory");if("INPUT"!==e.tagName){let t=e.closest(".category"),s=document.querySelector(".category.show");if(t){let e=t.nextElementSibling,o=!(!e||"UL"!=e.tagName)&&e;if(o){if(s){let e=s.nextElementSibling;s.classList.toggle("show"),e.classList.toggle("show")}t!==s&&(t.classList.toggle("show"),o.classList.toggle("show"))}}}if("INPUT"==e.tagName&&e.closest(".category")){let t=e,s=t.closest(".category").nextElementSibling,o=!!s&&s.querySelectorAll("input"),r="Asia"==s.previousElementSibling.querySelector("input").name;if(e.nextElementSibling&&o&&o&&"LABEL"!==e.nextElementSibling.tagName&&(t.checked?Object.keys(o).forEach((e=>{o[e].checked=!0})):Object.keys(o).forEach((e=>{o[e].checked=!1}))),"World"==t.name){let e=document.querySelector("#Asia"),t=e.closest(".category").nextElementSibling.querySelectorAll("input");e.checked=!1,Object.keys(t).forEach((e=>{t[e].checked=!1}))}r&&(document.querySelector("#World").checked=!1)}if(t){let e=!0,s=t.querySelectorAll("input"),o=t.previousElementSibling.querySelector("input"),r="Asia"==o.name;Object.keys(s).forEach((t=>{e=s[t].checked&&e})),o.checked=!!e,r&&(document.querySelector("#World").checked=!1)}}(e.target)})),document.querySelector(".posts").addEventListener("click",(e=>{let t=e.target.closest(".post_template");if(t){let e=t.dataset.postId,s=window.location.origin+`/posts/post/${e}`;window.location=s}})),document.querySelector(".reset").addEventListener("click",(function(){let e=document.querySelectorAll("input");Object.keys(e).forEach((t=>{let s=e[t],o=e[t].type;"checkbox"==o||"radio"==o?s.checked=!1:s.value=""}))})),document.querySelector(".refresh").addEventListener("click",o),document.querySelector(".search").addEventListener("click",(()=>{o()})),document.querySelector(".posts").addEventListener("scroll",(e=>{let t=document.querySelector(".spinner");(function(e){let t=!1;return e.offsetHeight+e.scrollTop>=e.scrollHeight-30&&(t=!0),t})(e.target)&&!t&&o()}))})();