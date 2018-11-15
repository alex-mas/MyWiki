import * as fs from 'fs';

export const deleteFolderRecursively = function (path: string) {
    if (!path || path === '/' || path.substring(0, 2) === ".." || path === 'C:') {
        return;
    }
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursively(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

export const deleteFolderContents = function (path: string) {
    if (!path || path === '/' || path.substring(0, 2) === "..") {
        return;
    }
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursively(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
}

/**
 * @description Applies callback function to all files inside the folder, including files of nested folders
 * @param {string} path
 * @param {function(path: string, file:string)} callback
 */
export const forEachFileIn = (path: string, callback: Function, filename?: string, filepath?: string) => {
    console.log(filename, filepath);
    if (!path || path === '/' || path.substring(0, 2) === '..') {
        return;
    }
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                forEachFileIn(curPath, callback, filename, path + '/');
            } else {
                callback(path + '/', file);
            }
        });
    }
    callback(filepath, filename);
};


export const copyFolder = (src: string, dest: string) => {
    if (!src || src === '/' || src.substring(0, 2) === '..' ||
        !dest || dest === '/' || dest.substring(0, 2) === '..') {
        return;
    }
    forEachFileIn(src, (filepath: string, filename: string) => {
        const srcPath = src+filepath+filename;
        const destPath =dest+filepath+filename;
        if(fs.lstatSync(srcPath).isDirectory()){
            if(!fs.existsSync(destPath)){
                fs.mkdirSync(destPath);
            }

        }else{
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

export default {
    deleteFolderContents,
    deleteFolderRecursively,
    copyFolder
}
