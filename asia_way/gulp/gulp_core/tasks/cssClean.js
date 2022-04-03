import del from 'del';
import { commonGulpVariables } from '../../gulpfile.js';

export const cssClean = () => {
    return del(commonGulpVariables.path.clean.css); 
}