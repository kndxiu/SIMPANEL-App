import WebSocket, { WebSocketServer as WS } from "ws";

class WebSocketServer {
  constructor(port) {
    this.port = port;
    this.wss = new WS({ port: this.port });
    this.onHostMessageCallback = null;
    this.onClientMessageCallback = null;
    this.onConfigCallback = null;
    this.onClientConnectCallback = null;
    this.onClientDisconnectCallback = null;
    this.currentClient = null;
    this.setup();
  }

  setup() {
    this.wss.on("connection", (ws) => {
      console.log("Client connected");

      if (this.currentClient) {
        console.log("Disconnecting previous client");
        this.currentClient.close(4000, "Another client connected");
      }

      this.currentClient = ws;

      if (this.onClientConnectCallback) {
        this.onClientConnectCallback();
      }

      ws.on("message", (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          this.handleMessage(parsedMessage);
        } catch (error) {
          console.error(`Error parsing message: ${error.message}`);
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected");

        if (ws === this.currentClient) {
          this.currentClient = null;
        }

        if (this.onClientDisconnectCallback) {
          this.onClientDisconnectCallback();
        }
      });
    });

    console.log(`WebSocket server is running on ws://localhost:${this.port}`);
  }

  handleMessage(message) {
    if (message.type === "host") {
      if (this.onHostMessageCallback) {
        this.onHostMessageCallback(message);
      }
    } else if (message.type === "client") {
      if (this.onClientMessageCallback) {
        this.onClientMessageCallback(message);
      }
    } else if (message.type === "config") {
      this.onConfigCallback(message);
    } else {
      console.warn(`Unknown message type: ${message.type}`);
    }
  }

  onHostMessage(callback) {
    this.onHostMessageCallback = callback;
  }

  onClientMessage(callback) {
    this.onClientMessageCallback = callback;
  }

  onConfig(callback) {
    this.onConfigCallback = callback;
  }

  onClientConnect(callback) {
    this.onClientConnectCallback = callback;
  }

  onClientDisconnect(callback) {
    this.onClientDisconnectCallback = callback;
  }

  isClientConnected() {
    return this.currentClient !== null;
  }

  send(message) {
    if (
      this.currentClient &&
      this.currentClient.readyState === WebSocket.OPEN
    ) {
      this.currentClient.send(JSON.stringify(message));
    }
  }

  close() {
    if (
      this.currentClient &&
      this.currentClient.readyState === WebSocket.OPEN
    ) {
      this.currentClient.close(1000, "Server is shutting down");
    }
    this.wss.close();
  }
}

export default WebSocketServer;
