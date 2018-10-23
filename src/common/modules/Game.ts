import { DEFAULT_IS_PRIVATE_GAME, DEFAULT_NB_PLAYER } from "../LimiteLimite";
import { LimiteLimiteGame } from "./LimiteLimiteGame";
import { Player } from "./Player";

export abstract class Game {
    public id: string
    public gameClass: any
    public gameInstance: any
    public creationDate: number
    public startGameDate?: number

    constructor(gameClass: any){
        this.gameClass = gameClass
        this.gameInstance = null
        this.id = Date.now().toString()
        this.creationDate = Date.now()
        this.startGameDate = undefined
    }

    start(...options: any[]){
        this.gameInstance = new this.gameClass(...options)
        this.startGameDate = Date.now()
    }

}