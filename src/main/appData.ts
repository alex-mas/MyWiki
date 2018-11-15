import * as fsp from '../utils/promisify-fs';
import * as Electron from 'electron';

export interface WindowConfig {
    width: number;
    height: number;
    x: number;
    y: number;
}

export const getWindowConfig: () => Promise<WindowConfig | undefined> = async () => {
    try {
        const appConfigExists = await fsp.exists('./appConfig');
        if(!appConfigExists){
            await fsp.mkdir('./appConfig');
        }
        const fileContents = await fsp.readFile('./appConfig/window.config.json', 'utf8');
        const windowConfig: WindowConfig = JSON.parse(fileContents);
        return windowConfig;
    } catch (e) {
        console.warn(e);
        return undefined;
    }
}

export const saveWindowConfig = (window: Electron.BrowserWindow) => {
    let windowConfig: WindowConfig;
    if(window.isMaximized()){
        const screen = require('electron').screen;
        windowConfig = {
            ...screen.getPrimaryDisplay().bounds
        }

    }else{
        windowConfig =  {
            ...window.getBounds()
        };
    }
    return fsp.writeFile('./appConfig/window.config.json', JSON.stringify(windowConfig), 'utf8');
}