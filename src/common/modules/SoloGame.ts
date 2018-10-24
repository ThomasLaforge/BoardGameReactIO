import { Game } from "./Game";
import { Player } from "./Player";
import { GameClass } from "..";

export class SoloGame extends Game {

    public player: Player

    constructor(gameClass: GameClass, player: Player){
        super(gameClass)
        this.player = player
    }

}