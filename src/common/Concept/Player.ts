import { SocketPlayer } from '../modules/SocketPlayer'

export class Player extends SocketPlayer {

    constructor(surname: string, socketid: string, score = 0){
        super(surname, socketid)
    }

}