import { SocketPlayer } from '../modules/SocketPlayer'

export class Player extends SocketPlayer {

    public score: number
    
    constructor(surname: string, socketid: string, score = 0){
        super(surname, socketid)
        this.score = score
    }

}