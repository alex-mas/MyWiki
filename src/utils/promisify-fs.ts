import * as fs from 'fs';
import { promisify } from 'util';

export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);
export const readdir = promisify(fs.readdir);
export const exists = promisify(fs.exists);
export const access = promisify(fs.access);
export const unlink = promisify(fs.unlink);
export const mkdir = promisify(fs.mkdir);
export const write = promisify(fs.write);
export const close = promisify(fs.close);
export const open = promisify(fs.open);

export default {
    writeFile,
    readFile,
    readdir,
    exists,
    access,
    unlink,
    mkdir,
    write,
    close,
    open,
}
