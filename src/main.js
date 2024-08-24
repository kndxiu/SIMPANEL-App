import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";
import WebSocketServer from "./server/websocketServer.js";
import "./server/expressServer.js";
import IP from "./server/ip.js";
import { MSFS_API } from "msfs-simconnect-api-wrapper";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadConfigFromFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading config file:", err);
    return null;
  }
};

const saveConfigToFile = async (filePath, config) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing config file:", err);
  }
};

let mainWindow;
let websocketServer;
let api;
let config = null;
let updateInterval = 250;
let updateSchedule;

const extractSimvars = (config) => {
  const simvars = [];

  const extractFromControls = (controls) => {
    controls.forEach((control) => {
      if (control.simvar) {
        if (Array.isArray(control.simvar)) {
          simvars.push(...control.simvar);
        } else {
          simvars.push(control.simvar);
        }
      }
    });
  };

  if (config.panels) {
    config.panels.forEach((panel) => {
      if (panel.controls) {
        extractFromControls(panel.controls);
      }
    });
  }

  return simvars;
};

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
    const simvars = extractSimvars(config);
    updateSchedule = setInterval(() => {
      try {
        api.get(...simvars).then((data) => {
          if (websocketServer)
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

const init = async () => {
  // Load default config or prompt for a new config file
  config =
    (await loadConfigFromFile(path.join(__dirname, "config.json"))) || {};
  console.log(config);

  ipcMain.handle("startServer", async () => {
    const localIp = IP.getLocalIp();
    console.log("Local IP address:", localIp);

    const ipInstance = new IP(localIp);
    const encodedIp = ipInstance.toEncoded();

    websocketServer = new WebSocketServer(8056);

    websocketServer.onHostMessage((message) => {
      console.log("Message sent:", message);
    });

    websocketServer.onClientMessage((message) => {
      if (message.simvar) handleSimvar(message.simvar, message.value);
      else if (message.simevent)
        handleSimEvent(message.simevent, message.value);
    });

    websocketServer.onClientConnect(() => {
      startSchedule();
      websocketServer.send(
        JSON.stringify({
          type: "cfg",
          data: config,
        })
      );
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
      websocketServer = null;
      console.log("Server stopped");
    } else {
      console.log("No server to stop");
    }
  });

  ipcMain.handle("importConfig", async () => {
    if (websocketServer) {
      // Server is running, show error dialog
      await dialog.showErrorBox(
        "Import Error",
        "Cannot import config while the server is running. Please stop the server first."
      );
      return null;
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const importedConfig = await loadConfigFromFile(filePath);

    if (importedConfig) {
      config = importedConfig;
      await saveConfigToFile(path.join(__dirname, "config.json"), config);
      console.log("Config imported and saved.");
      return config;
    } else {
      await dialog.showErrorBox(
        "Import Error",
        "Failed to load the configuration file. Please ensure it is a valid JSON file."
      );
      return null;
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
      // devTools: false,
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
