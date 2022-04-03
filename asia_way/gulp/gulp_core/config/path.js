import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());
const srcFolder = '../static';
const scssFilesSrcFolder = `${srcFolder}/scss/**/*.scss`;
const scssFilesBuildFolder = `${srcFolder}/css`;
const jsFilesSrcFolder = `${srcFolder}/js/**/*.js`;
const jsFilesBuildFolder = `${srcFolder}/js/bundled`;

export const path = {
    src: {
        jsFilesSrcFolder: jsFilesSrcFolder,
        scssFilesSrcFolder: scssFilesSrcFolder,
    },
    build: {
        jsFilesBuildFolder: jsFilesBuildFolder,
        cssFilesBuildFolder: scssFilesBuildFolder,
    },
    watch: {
        js: jsFilesSrcFolder,
        scss: scssFilesSrcFolder,
    },
    clean: {
        css: scssFilesBuildFolder,
    },
    srcFolder: srcFolder,
    root: rootFolder,
}
