const handleMinimize = () => {
  window.appFunctions.minimizeWindow();
};

const handleClose = () => {
  window.appFunctions.closeWindow();
};

const roomCodeInput = document.getElementById("roomCode");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const minimizeButton = document.getElementById("minimizeButton");
const closeButton = document.getElementById("closeButton");
const copyButton = document.getElementById("copyButton");

const createRoom = async () => {
  const ip = await window.appFunctions.startServer();
  roomCodeInput.value = ip;
  startButton.style.display = "none";
  stopButton.style.display = "unset";
};

const closeRoom = async () => {
  await window.appFunctions.stopServer();
  roomCodeInput.value = "";
  startButton.style.display = "unset";
  stopButton.style.display = "none";
};

const copyCode = () => {
  navigator.clipboard.writeText(roomCodeInput.value);
};

startButton.addEventListener("click", createRoom);
stopButton.addEventListener("click", closeRoom);
minimizeButton.addEventListener("click", handleMinimize);
closeButton.addEventListener("click", handleClose);
copyButton.addEventListener("click", copyCode);
