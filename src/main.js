import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";
import WebSocketServer from "./server/server.js";
import IP from "./server/ip.js";
import { MSFS_API } from "msfs-simconnect-api-wrapper";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;
let websocketServer;
let api;
let config;
let updateInterval = 250;
let updateSchedule;

const updateStatus = () => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("status-update", {
      msfsConnected: api && api.connected,
      panelConnected: websocketServer && websocketServer.isClientConnected(),
    });
  }
};

const startSchedule = () => {
  if (config && api.connected) {
    if (updateSchedule) clearInterval(updateSchedule);
    updateSchedule = setInterval(() => {
      try {
        api.get(...config).then((data) => {
          websocketServer.send(
            JSON.stringify({
              type: "aircraft",
              data,
            })
          );
        });
      } catch (error) {
        clearInterval(updateSchedule);
        console.log(error);
      }
    }, updateInterval);
  }
};

const onConnect = () => {
  console.log("MSFS Connected");
  api.connected = true;
  updateStatus();
  startSchedule();
};

const initMsfs = () => {
  api = new MSFS_API();
  api.connect({
    autoReconnect: true,
    retries: Infinity,
    retryInterval: 5,
    onConnect,
    onRetry: (_, s) => {
      api.connected = false;
      updateStatus();
    },
  });
};

const handleSimvar = (name, value) => {
  if (api && api.connected) {
    api.set(name, value);
  }
};

const handleSimEvent = (id, value) => {
  if (api && api.connected) {
    if (value) api.trigger(id, value);
    else api.trigger(id);
  }
};

const init = () => {
  ipcMain.handle("startServer", async () => {
    const localIp = IP.getLocalIp();
    console.log("Local IP address:", localIp);

    const ipInstance = new IP(localIp);
    const encodedIp = ipInstance.toEncoded();

    websocketServer = new WebSocketServer(8080);

    websocketServer.onHostMessage((message) => {
      console.log("Message sent:", message);
    });

    websocketServer.onClientMessage((message) => {
      if (message.simvar) handleSimvar(message.simvar, message.value);
      else if (message.simevent)
        handleSimEvent(message.simevent, message.value);
    });

    websocketServer.onConfig((data) => {
      config = data.message;
      startSchedule();
    });

    websocketServer.onClientConnect(() => {
      updateStatus();
    });

    websocketServer.onClientDisconnect(() => {
      if (updateSchedule) {
        clearInterval(updateSchedule);
        updateSchedule = null;
      }
      updateStatus();
    });

    return encodedIp;
  });

  ipcMain.handle("stopServer", () => {
    if (websocketServer) {
      websocketServer.close();
      console.log("Server stopped");
    } else {
      console.log("No server to stop");
    }
  });

  ipcMain.on("close", () => {
    mainWindow.close();
  });

  ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });

  initMsfs();
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
    },
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    maximizable: false,
    nodeIntegration: true,
    fullscreenable: false,
    icon: path.join(__dirname, "assets", "images", "icon.ico"),
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  init();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
