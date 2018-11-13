const path = require('path');
const url = require('url');
const fs = require('fs');
const child_process = require('child_process');
import * as Electron from 'electron'
const { app, Menu, BrowserWindow, ipcMain, WebContents } = require('electron');


let loadingWindow: Electron.BrowserWindow;
let mainWindow: Electron.BrowserWindow;

const setApplicationMenu = () => {


};


console.log('Node env: ', process.env.NODE_ENV);

app.on("ready", () => {
    console.log('app ready');
    setApplicationMenu();
    const screen = require('electron').screen;
    debugger;
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
        fullscreenable: true
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.once('did-finish-load', () => {
        loadingWindow.close();
        mainWindow.show();

    });

    mainWindow.on('close', () => {
        //@ts-ignore
        mainWindow = null;
    })
    loadingWindow.on('close', () => {
        console.log('closing loading window');
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
