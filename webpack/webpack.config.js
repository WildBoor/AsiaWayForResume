import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let projectJsStaticFilesPath = './asia_way/static/js';
let pagesDir = projectJsStaticFilesPath + '/pages/';
let outputPath = projectJsStaticFilesPath + '/bundles/';

let config = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
        ]
    },
    mode: 'production',
};


let postConfig = Object.assign({}, config, {
    entry: pagesDir + 'post.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "post.bundle.js"
    },
});


let postsConfig = Object.assign({}, config, {
    entry: pagesDir + 'posts.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "posts.bundle.js"
    },
});


let postCreateConfig = Object.assign({}, config, {
    entry: pagesDir + 'postCreate.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "postCreate.bundle.js"
    },
});


let logInConfig = Object.assign({}, config, {
    entry: pagesDir + 'logIn.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "logIn.bundle.js"
    },
});

let signUpConfig = Object.assign({}, config, {
    entry: pagesDir + 'signUp.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "signUp.bundle.js"
    },
});


let userConfig = Object.assign({}, config, {
    entry: pagesDir + 'user.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "user.bundle.js"
    },
});


let carouselPostsConfig = Object.assign({}, config, {
    entry: projectJsStaticFilesPath + '/carouselPosts.js',
    output: {
        path: path.resolve(__dirname, '.' + outputPath),
        filename: "carouselPosts.bundle.js"
    },
});


export default [
    postConfig,
    postsConfig,
    postCreateConfig,
    logInConfig,
    signUpConfig,
    userConfig,
    carouselPostsConfig
]
