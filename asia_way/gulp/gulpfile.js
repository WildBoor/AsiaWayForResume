import gulp from 'gulp';
import { path } from './gulp_core/config/path.js';
import { plugins } from './gulp_core/config/plugins.js';

export const commonGulpVariables = {
    path: path,
    gulp: gulp,
    plugins: plugins,
}

import { scssToCss } from './gulp_core/tasks/scssToCss.js';
// import { cssClean } from './gulp_core/tasks/cssClean.js';

function watcher() {
    gulp.watch(commonGulpVariables.path.watch.scss, scssToCss)
}

const dev = gulp.series(scssToCss, watcher)

gulp.task('default', dev)