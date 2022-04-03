(()=>{"use strict";function e(){this.status="",this.messageContent="",this.setStatus=e=>this.status=e,this.setMessage=e=>this.messageContent=`<div class="close"><i class="message_btn_close btn bx bx-x" ></i></div><div class="message">${e}</div>`,this.getMessage=()=>this.message,this.getMessageElement=()=>{let e=document.createElement("div");return e.setAttribute("class",`modal_message ${this.status}`),e.innerHTML=this.messageContent,e}}function t(e){let t=document.querySelector(".notification_block");t&&t.classList.toggle("hide"),setTimeout((()=>{t&&t.remove()}),setTimeout)}let s={required:function(e){return"object"==typeof e?Object.keys(e).length:Boolean(e)},minLength:function(e,t){return e.length>=t},maxLength:function(e,t){return e.length<=t},isEmail:function(e){let t=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);return Boolean(e.match(t))},isPasswordRepeated:function(e,t){return e===t}};function r(s,r){t(),setTimeout((()=>{let t=s.querySelectorAll(".error_field");t&&Object.keys(t).forEach((e=>{t[e].classList.toggle("error_field")}));let o=Object.keys(r),i=document.createElement("div");i.setAttribute("class","notification_block"),document.body.appendChild(i),o.forEach((t=>{let o,n=new e,c=s.querySelector(`input[name="${t}"]`),l=s.querySelector(`textarea[name="${t}"]`);c&&s.querySelector(`input[name="${t}"]`).classList.toggle("error_field"),l&&s.querySelector(`textarea[name="${t}"]`).classList.toggle("error_field"),o=r[t][0].message?r[t][0].message:r[t][0],n.setMessage(o),n.setStatus("error"),i.appendChild(n.getMessageElement())}))}),500)}function o(){let e=document.querySelector(".post_categories_params"),t={};if(e){let s=e.querySelectorAll("input");Object.keys(s).forEach((e=>{let r=s[e].closest(".category");if(r){let e=r.querySelector("input"),s=e.name;t[s]={},t[s].category_id=e.dataset.categoryId,t[s].is_category_checked=e.checked,t[s].subcategories=[]}})),t&&Object.keys(t).forEach((s=>{let r=e.querySelector(`input[name="${s}"]`),o=e.querySelector(`ul.${s}`);if(o){let e=o.querySelectorAll("input");Object.keys(e).forEach((r=>{let o=e[r];o.checked&&t[s].subcategories.push(o.dataset.subcategoryId)}))}t[s].subcategories.length||r.checked||delete t[s]}))}return t}document.addEventListener("click",(e=>{if(e.target.classList.contains("message_btn_close")){let t=e.target.closest(".modal_message");t.classList.toggle("hide"),setTimeout((()=>{t.remove()}),400)}}));let i={title:["required",{minLength:2},{maxLength:300}],content:["required"],post_subcategory:["required"],preview_image_url:["required"],preview_text:["required"]},n={title:{required:"Enter your new post title.",minLength:"Your new post title is too short. Minimum length is 2.",maxLength:"Your new post title is too long. Maximum length is 300."},content:{required:"Your new post content is empty."},post_subcategory:{required:"Choose categories for your post."},preview_image_url:{required:"There is no images in your post."},preview_text:{required:"Something went wrong with preview text."}},c=document.querySelector(".post_create_form");c.setAttribute("novalidate","novalidate"),document.querySelector(".post_categories_params").addEventListener("click",(e=>{!function(e){let t=e.closest("ul.subcategory");if("INPUT"!==e.tagName){let t=e.closest(".category"),s=document.querySelector(".category.show");if(t){let e=t.nextElementSibling,r=!(!e||"UL"!=e.tagName)&&e;if(r){if(s){let e=s.nextElementSibling;s.classList.toggle("show"),e.classList.toggle("show")}t!==s&&(t.classList.toggle("show"),r.classList.toggle("show"))}}}if("INPUT"==e.tagName&&e.closest(".category")){let t=e,s=t.closest(".category").nextElementSibling,r=!!s&&s.querySelectorAll("input"),o="Asia"==s.previousElementSibling.querySelector("input").name;if(e.nextElementSibling&&r&&r&&"LABEL"!==e.nextElementSibling.tagName&&(t.checked?Object.keys(r).forEach((e=>{r[e].checked=!0})):Object.keys(r).forEach((e=>{r[e].checked=!1}))),"World"==t.name){let e=document.querySelector("#Asia"),t=e.closest(".category").nextElementSibling.querySelectorAll("input");e.checked=!1,Object.keys(t).forEach((e=>{t[e].checked=!1}))}o&&(document.querySelector("#World").checked=!1)}if(t){let e=!0,s=t.querySelectorAll("input"),r=t.previousElementSibling.querySelector("input"),o="Asia"==r.name;Object.keys(s).forEach((t=>{e=s[t].checked&&e})),r.checked=!!e,o&&(document.querySelector("#World").checked=!1)}}(e.target)})),document.querySelector(".submit").addEventListener("click",(function(l){l.preventDefault();let a=function(e,t,i){let n=function(e,t){let s=e.querySelectorAll("input"),r=e.querySelectorAll("textarea"),i=document.querySelector(".post_create_form"),n={};return s&&s.forEach((e=>{let s=e.name;t.includes(s)&&("gender"==s?e.checked&&(n[s]=e.value):n[s]=e.value)})),r&&r.forEach((e=>{if(e.closest(".django-ckeditor-widget")){let t=CKEDITOR.instances[`id_${e.name}`],s=t.getData();if(n[e.name]=s,s.length){let e=200,s=t.document.getBody().getText().trim().slice(0,e),r=t.document.findOne("img");n.preview_image_url=r?r.getAttribute("src"):"",n.preview_text=s}}else n[e.name]=e.value})),i&&Object.assign(n,{post_subcategory:o()}),n}(e,Object.keys(t)),c=function(e,t,r){let o=Object.keys(e),i={};return o.forEach((o=>{t[o].forEach((t=>{let n="object"==typeof t,c=n?Object.keys(t)[0]:t,l=n?s[c]:s[t],a=!0;if(n)"maxLength"!=c&&"minLength"!=c||(a=l(e[o],t[c]));else if("isPasswordRepeated"==c){let t=e.password;t&&(a=l(t,e[o]))}else a=l(e[o]);if(!a){let e=r[o][c];i[o]||(i[o]=[]),e||console.log(`There is no error message for validator '${c}' for '${o}' field`),i[o].push(e)}}))})),i}(n,t,i),l=!Object.keys(c).length,a={isValid:l,formData:""};return l?a.formData=n:r(e,c),a}(c,i,n);if(a.isValid){let s=a.formData;!function(s,o,i,n=null){let c=(a="csrftoken",function(){let e=document.cookie,t={};return e&&""!==e&&(t=e.split(";").map((e=>e.split("="))).reduce(((e,t)=>{let s=t[0].trim(),r=t[1];return e[s]={},e[s]=r,e}),t)),t}()[a]),l={};var a;l=fetch(`${i}/`,{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","X-Requested_with":"XMLHttpRequest","X-CSRFToken":c},body:JSON.stringify(o)}).then((e=>e.json())).then((o=>{if("success"==o.status){if(t(),o.success_message){let t=document.createElement("div"),s=new e;s.setStatus(o.status),s.setMessage(o.success_message),t.setAttribute("class","notification_block"),t.appendChild(s.getMessageElement()),document.body.appendChild(t)}n&&setTimeout((()=>{window.location=n}),500),o.redirect_url&&setTimeout((()=>{window.location=o.redirect_url}),500)}return"error"==o.status&&(console.log(o.errors),console.log(JSON.parse(o.errors)),r(s,JSON.parse(o.errors))),o})).catch((e=>{console.log(e)}))}(c,s,"create_new_post")}}))})();