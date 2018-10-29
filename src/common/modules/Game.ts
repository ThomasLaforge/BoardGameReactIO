import { GameClass, GameType, getGameClass, GameTypeClass } from "..";

export abstract class Game {
    public id: string
    public type: GameType
    public gameInstance: any
    public creationDate: number
    public startGameDate?: number

    constructor(gameType: GameType){
        this.id = Date.now().toString()
        this.type = gameType
        this.gameInstance = null
        this.creationDate = Date.now()
        this.startGameDate = undefined
        console.log('game constructor', this.type)
    }

    start(...options: any[]){
        let gameClass = getGameClass(this.type)
        this.gameInstance = new gameClass(...options)
        console.log('Game start', options, this.gameInstance)
        this.startGameDate = Date.now()
    }

}