import { Game } from "./Game";
import { GameClass } from "..";
import { SocketPlayer } from "./SocketPlayer";

export class SoloGame extends Game {

    public player: SocketPlayer

    constructor(gameClass: GameClass, player: SocketPlayer){
        super(gameClass)
        this.player = player
    }

}