import { WebSocketServer } from "ws";
import  GameManager  from "./GameManager.js";

const wss = new WebSocketServer({port:8080});

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  })
  ws.on("disconnect", () => gameManager.removeUser(ws))
});