const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let astroServer;

const ASTRO_PORT = 4321;
const ASTRO_URL = `http://localhost:${ASTRO_PORT}`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(ASTRO_URL);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startAstroServer() {
  return new Promise((resolve, reject) => {
    const distPath = path.join(__dirname, '..', 'dist', 'server', 'entry.mjs');
    
    astroServer = spawn('node', [distPath], {
      env: { ...process.env, PORT: ASTRO_PORT },
      cwd: path.join(__dirname, '..'),
    });

    astroServer.stdout.on('data', (data) => {
      console.log(`Astro: ${data}`);
    });

    astroServer.stderr.on('data', (data) => {
      console.error(`Astro Error: ${data}`);
    });

    astroServer.on('error', (error) => {
      console.error(`Failed to start Astro server: ${error}`);
      reject(error);
    });

    setTimeout(() => {
      console.log('Astro server started');
      resolve();
    }, 2000);
  });
}

app.on('ready', async () => {
  try {
    await startAstroServer();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', () => {
  if (astroServer) {
    astroServer.kill();
  }
});
