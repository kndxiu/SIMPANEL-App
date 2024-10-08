const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("appFunctions", {
  minimizeWindow: () => ipcRenderer.send("minimize"),
  closeWindow: () => ipcRenderer.send("close"),
  startServer: async () => await ipcRenderer.invoke("startServer"),
  stopServer: () => ipcRenderer.invoke("stopServer"),
  importConfig: () => ipcRenderer.invoke("importConfig"),
});

ipcRenderer.on("status-update", (event, status) => {
  const { msfsConnected, panelConnected } = status;

  const msfsStatusElement = document.getElementById("msfs-status");
  msfsStatusElement.classList.toggle("bg-green-500", msfsConnected);
  msfsStatusElement.classList.toggle("bg-red-500", !msfsConnected);
  msfsStatusElement.querySelector("div").textContent = msfsConnected
    ? "MSFS Connected"
    : "MSFS Disconnected";

  const panelStatusElement = document.getElementById("panel-status");
  panelStatusElement.classList.toggle("bg-green-500", panelConnected);
  panelStatusElement.classList.toggle("bg-red-500", !panelConnected);
  panelStatusElement.querySelector("div").textContent = panelConnected
    ? "Panel Connected"
    : "Panel Disconnected";
});

ipcRenderer.on("updateCheck", (event, data) => {
  const { appVersion, fetchedVersion } = data;

  const versionText = document.getElementById("version");
  console.log(appVersion, fetchedVersion);

  let content = `v${appVersion.toString().split("").join(".")} `;

  if (appVersion >= fetchedVersion) content += "Latest";
  else
    content +=
      "<a class='text-sky-500' target='_blank' href='https://simpanel.kndxiu.xyz/changelog'> Update Available</a>";

  versionText.innerHTML = content;
});
