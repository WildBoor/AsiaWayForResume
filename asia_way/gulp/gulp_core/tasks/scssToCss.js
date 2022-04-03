import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
// import webpcss from 'gulp-webpcss'

import { commonGulpVariables } from '../../gulpfile.js';

const sass = gulpSass(dartSass);

export const scssToCss = () => {
    return commonGulpVariables.gulp
        .src(commonGulpVariables.path.src.scssFilesSrcFolder, { sourcemaps: true },)
        .pipe(
            commonGulpVariables.plugins.plumber(
                // commonGulpVariables.plugins.notify.onError({
                //         title: 'SCSS',
                //         message: 'Error: <% error.message %>'
                // })
            )
        )
        .pipe(
            sass({
                outputStyle: 'expanded'
            })
        )
        .pipe(groupCssMediaQueries())
        // .pipe(webpcss({
        //     webpClass: '.webp',
        //     noWebpClass: '.no-webp',
        // }))   
        .pipe(
            autoprefixer({
                grid: true,
                flexbox: true,
                overrideBrowserslist: ['last 3 versions'],
                cascade: true,
            })
        )
        .pipe(cleanCss())
        .pipe(commonGulpVariables.plugins.rename({ extname: '.min.css' }))
        .pipe(commonGulpVariables.gulp.dest(commonGulpVariables.path.build.cssFilesBuildFolder));
}