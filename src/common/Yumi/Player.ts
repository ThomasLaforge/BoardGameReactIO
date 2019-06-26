import { Card } from "./Card";
import { LIMIT_SCORE } from "./defs";
import { Hand } from "./Hand";

export class Player {

    constructor(
        public username: string,
        public socketid: string,
        public objectif?: number,
        public hand = new Hand([]),
        public hasBeenOnObjectiveScore = false,
        public score = 0
    ) {

    }

    addScore(turnScore: number){
        const multiplier = this.hasBeenOnObjectiveScore ? 2 : 1
        this.score += turnScore * multiplier
        if( !this.hasBeenOnObjectiveScore && [LIMIT_SCORE, this.objectif].includes(this.score) ){
            this.score = 0
            this.hasBeenOnObjectiveScore = true
        }
    }

    getHandValue(){
        return this.hand.getValue()
    }

    hasLost(){
        return this.score > LIMIT_SCORE
    }

    isEqual(player: Player){
        return this.socketid === player.socketid
    }
}