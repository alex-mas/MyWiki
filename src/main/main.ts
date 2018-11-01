const path = require('path');
const url = require('url');
const fs = require('fs');
import * as Electron from 'electron';

const {app, Menu, BrowserWindow} = require('electron');



const setApplicationMenu = () => {


};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (process.env.ENV !== "production") {
    const userDataPath = app.getPath("userData");
    app.setPath("userData", `${userDataPath} (${process.env.ENV})`);
}

app.on("ready", () => {
    setApplicationMenu();
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegrationInWorker: true,
            webSecurity: false,
        }
    });
    mainWindow.setFullScreenable(true);
    mainWindow.maximize();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: "file:",
        slashes: true
    }));
    if (process.env.ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
});

app.on("window-all-closed", () => {
    app.quit();
});
