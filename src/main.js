import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";
import WebSocketServer from "./server/websocketServer.js";
import "./server/expressServer.js";
import IP from "./server/ip.js";
import { MSFS_API } from "msfs-simconnect-api-wrapper";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VERSION = 110;
let mainWindow;
let websocketServer;
let api;
let config = null;
let updateInterval = 250;
let updateSchedule;

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

const extractSimvars = (config) => {
  const simvars = new Set();
  const addSimvarsFromControls = (controls) => {
    controls.forEach((control) => {
      if (control.simvar) {
        if (Array.isArray(control.simvar)) {
          control.simvar.forEach((v) => simvars.add(v));
        } else {
          simvars.add(control.simvar);
        }
      }
    });
  };

  if (config.panels) {
    config.panels.forEach((panel) => {
      if (panel.controls) addSimvarsFromControls(panel.controls);
    });
  }

  if (config.events) {
    config.events.forEach((event) => {
      event.conditions.forEach((condition) => simvars.add(condition.simvar));
    });
  }

  return Array.from(simvars);
};

const evaluateCondition = (condition, value) => {
  switch (condition.condition) {
    case ">":
      return value > condition.value;
    case "<":
      return value < condition.value;
    case ">=":
      return value >= condition.value;
    case "<=":
      return value <= condition.value;
    case "==":
      return value == condition.value;
    case "!=":
      return value != condition.value;
    default:
      return false;
  }
};

const areEventConditionsMet = (event, simvarData) => {
  return event.conditions.every((condition) => {
    const simvar = condition.simvar.replaceAll(" ", "_");
    const simvarValue = simvarData[simvar];
    return evaluateCondition(condition, simvarValue);
  });
};

const executeEventActions = (actions) => {
  actions.forEach((action) => {
    if (action.simevent) handleSimEvent(action.simevent, action.value);
    if (action.simvar && action.value !== undefined) {
      handleSimvar(action.simvar, action.value);
    }
  });
};

const handleSimvar = (name, value) => {
  if (api && api.connected) api.set(name, value);
};

const handleSimEvent = (id, value) => {
  if (api && api.connected) {
    if (value || value != undefined) api.trigger(id, value);
    else api.trigger(id);
  }
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
  if (config && api && api.connected) {
    if (updateSchedule) clearInterval(updateSchedule);
    const simvars = extractSimvars(config);
    let eventStatus = config.events.map(() => false);

    updateSchedule = setInterval(() => {
      api.get(...simvars).then((simvarData) => {
        if (websocketServer) {
          websocketServer.send(
            JSON.stringify({
              type: "aircraft",
              data: simvarData,
            })
          );
        }

        if (config.events)
          config.events.forEach((event, index) => {
            const conditionsMet = areEventConditionsMet(event, simvarData);

            if (conditionsMet && !eventStatus[index]) {
              executeEventActions(event.actions);
              eventStatus[index] = true;
            } else if (!conditionsMet) {
              eventStatus[index] = false;
            }
          });
      });
    }, updateInterval);
  }
};

const initMsfs = () => {
  api = new MSFS_API();
  api.connect({
    autoReconnect: true,
    retries: Infinity,
    retryInterval: 5,
    onConnect: () => {
      api.connected = true;
      updateStatus();
      startSchedule();
    },
    onRetry: () => {
      api.connected = false;
      updateStatus();
    },
  });
};

const checkForUpdates = async () => {
  fetch("https://api.github.com/repos/kndxiu/SIMPANEL-App/releases/latest")
    .then((response) => response.json())
    .then((data) => {
      const versionName = data.name.split("simpanel-v").pop();
      const versionNumber = parseInt(versionName.replace(/\./g, ""), 10);
      if (mainWindow) {
        mainWindow.webContents.send("updateCheck", {
          appVersion: VERSION,
          fetchedVersion: versionNumber,
        });
      }
    });
};

const init = async () => {
  checkForUpdates();
  config =
    (await loadConfigFromFile(path.join(__dirname, "config.json"))) || {};

  ipcMain.handle("startServer", async () => {
    const localIp = IP.getLocalIp();
    const ipInstance = new IP(localIp);
    websocketServer = new WebSocketServer(8056);

    websocketServer.onClientMessage((message) => {
      if (message.simvar) handleSimvar(message.simvar, message.value);
      else if (message.simevent)
        handleSimEvent(message.simevent, message.value);
    });

    websocketServer.onClientConnect(() => {
      startSchedule();
      websocketServer.send(JSON.stringify({ type: "cfg", data: config }));
      updateStatus();
    });

    websocketServer.onClientDisconnect(() => {
      if (updateSchedule) clearInterval(updateSchedule);
      updateSchedule = null;
      updateStatus();
    });

    return ipInstance.toEncoded();
  });

  ipcMain.handle("stopServer", () => {
    if (websocketServer) {
      websocketServer.close();
      websocketServer = null;
      console.log("Server stopped");
    }
  });

  ipcMain.handle("importConfig", async () => {
    if (websocketServer) {
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

    if (result.canceled || result.filePaths.length === 0) return null;

    const filePath = result.filePaths[0];
    const importedConfig = await loadConfigFromFile(filePath);

    if (importedConfig) {
      config = importedConfig;
      await saveConfigToFile(path.join(__dirname, "config.json"), config);
      return config;
    } else {
      await dialog.showErrorBox(
        "Import Error",
        "Failed to load the configuration file. Please ensure it is a valid JSON file."
      );
      return null;
    }
  });

  ipcMain.on("close", () => mainWindow.close());
  ipcMain.on("minimize", () => mainWindow.minimize());
  initMsfs();
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    icon: path.join(__dirname, "assets", "images", "icon.ico"),
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  init();
};

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
