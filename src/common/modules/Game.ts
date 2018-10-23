import { GameClass, GameType, getGameClass, GameTypeClass } from "..";

export abstract class Game {
    public id: string
    public type: GameType
    public gameClass: GameClass
    public gameInstance: any
    public creationDate: number
    public startGameDate?: number

    constructor(gameType: GameType){
        this.type = gameType
        this.gameClass = getGameClass(gameType)
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