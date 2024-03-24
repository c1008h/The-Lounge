const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const appURL = isDev
        ? 'http://localhost:3000' // If in development, load from localhost
        : url.format({
            pathname: path.join(__dirname, './out/index.html'), // If in production, load from build directory
            protocol: 'file:',
            slashes: true,
        });
    win.loadURL(appURL);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
