import { Player } from "./Player";
import { Combination } from "./Combination";

export class Turn {

    public player: Player
    public combination: Combination

    constructor(player: Player, combination: Combination){
        this.player = player
        this.combination = combination
    }

}