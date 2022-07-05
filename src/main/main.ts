const path = require('path');
const url = require('url');
import * as Electron from 'electron';
import { getWindowConfig, saveWindowConfig } from './appData';
const { app, BrowserWindow } = require('electron');
const {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF
} = require('electron-devtools-installer');
const installExtension = require('electron-devtools-installer').default;


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
    width: 220,
    height: 220,
    transparent: true,
    frame: false
  });
  loadingWindow.show();
  loadingWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loader.html'),
    protocol: 'file',
    slashes: true
  }))

  const config: Electron.BrowserWindowConstructorOptions = {
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webSecurity: true,
      webviewTag: true,
      contextIsolation: false
    },
    fullscreenable: true,
    width: windowConfig ? windowConfig.width : undefined,
    height: windowConfig ? windowConfig.height : undefined,
    x: windowConfig ? windowConfig.x : undefined,
    y: windowConfig ? windowConfig.y : undefined
  }
  mainWindow = new BrowserWindow(config);
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

  });
  loadingWindow.on('close', () => {
    //@ts-ignore
    loadingWindow = null;
  });

  mainWindow.webContents.on('will-attach-webview', (e, pref: Electron.WebPreferences, params) => {
    pref.preload = undefined;
    pref.nodeIntegration = false,
      pref.nodeIntegrationInWorker = false;
    pref.allowRunningInsecureContent = false;
    pref.contextIsolation = true;
    pref.safeDialogs = true;
    pref.sandbox = true;
    //@ts-ignore
    if (pref.preloadURL) {
      //@ts-ignore
      pref.preloadURL = undefined;
    }

  });
  if (process.env.NODE_ENV === "development") {
    console.log('installing dev tools');
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS, REACT_PERF])
      .then((v: any) => {
        console.log('chrome extensions installed succesfully');
        mainWindow.webContents.openDevTools();
      })
      .catch((e: any) => {
        console.warn('error installing chrome extensions', e);
      });
  }
});


app.on("window-all-closed", () => {
  app.quit();
});
