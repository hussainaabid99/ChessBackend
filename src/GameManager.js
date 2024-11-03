import { Game } from "./Game.js";
import { INIT_GAME, MOVE } from "./messages.js";

export default class GameManager{
    games
    users

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);

    }

    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }

    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("Received message: ", message);

            if(message.type === INIT_GAME) {
                if(this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
            } else {
                this.pendingUser = socket;
                socket.send(JSON.stringify({
                    type: INIT_GAME,
                    payload: {
                        message: "Waiting for opponent"
                    }
                }))
            }

            if(message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game) {
                    game.makeMove(socket, message.move);
                }
            }
        })
    }
}