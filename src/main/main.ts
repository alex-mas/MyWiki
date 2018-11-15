const path = require('path');
const url = require('url');
import * as Electron from 'electron'
import { saveWindowConfig, getWindowConfig } from './appData';
const { app, Menu, BrowserWindow, ipcMain, WebContents } = require('electron');



let loadingWindow: Electron.BrowserWindow;
let mainWindow: Electron.BrowserWindow;



console.log('Node env: ', process.env.NODE_ENV);

app.on("ready", async () => {
    console.log('app ready');
    let windowConfig = await getWindowConfig();
    const screen = require('electron').screen;
    loadingWindow = new BrowserWindow({
        x: screen.getPrimaryDisplay().bounds.width / 2 - 100,
        y: screen.getPrimaryDisplay().bounds.height / 2 - 100,
        transparent: true,
        frame: false
    });
    loadingWindow.show();
    loadingWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loader.html'),
        protocol: 'file',
        slashes: true
    }))
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegrationInWorker: true,
            webSecurity: true
        },
        fullscreenable: true,
        width: windowConfig ? windowConfig.width : undefined,
        height: windowConfig ? windowConfig.height : undefined,
        x: windowConfig ? windowConfig.x : undefined,
        y: windowConfig ? windowConfig.y : undefined
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.once('did-finish-load', () => {
        if (!windowConfig) {
            mainWindow.maximize();
        }
        loadingWindow.close();
        mainWindow.show();
    });

    mainWindow.on('close', () => {
        saveWindowConfig(mainWindow).then(() => {
            //@ts-ignore
            mainWindow = null;
        }).catch((e) => {
            console.log(e);
        })

    })
    loadingWindow.on('close', () => {
        //@ts-ignore
        loadingWindow = null;
    })
    if (process.env.ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
});


app.on("window-all-closed", () => {
    app.quit();
});
