const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'AI CODE Studio & Vision Desktop',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
  });

  // Load the running application on port 3000
  const appUrl = 'http://localhost:3000';
  
  const loadWithRetry = (retries = 10) => {
    mainWindow.loadURL(appUrl).catch((err) => {
      if (retries > 0) {
        setTimeout(() => loadWithRetry(retries - 1), 1000);
      } else {
        console.error('Could not connect to backend server:', err);
      }
    });
  };

  loadWithRetry();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Start the backend server
  const serverPath = path.join(__dirname, '../dist/server.cjs');
  serverProcess = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: '3000', NODE_ENV: 'production' },
  });

  serverProcess.stdout.on('data', (data) => console.log(`[Server]: ${data}`));
  serverProcess.stderr.on('data', (data) => console.error(`[Server Err]: ${data}`));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
