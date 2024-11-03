import { Chess } from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from './messages.js';

export class Game{

    startTime;

    constructor( player1 , player2 ){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        })) 
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    } 

    makeMove(socket, move ){
        //validate the type of move
        if(this.board.moves.length % 2 == 0 && socket !== this.player1) {
            return
        }
        if(this.board.moves.length % 2 == 0 && socket !== this.player2){
            return;
        }

        try {
        this.board.move(move);
            
        } catch (error) {
            console.log(error);
            return;
        }

        //check if game over

        if(this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        
        if(this.board.moves.length %2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
            return;
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }
    }
}