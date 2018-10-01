import { serializable } from 'serializr';

export class SocketPlayer {

    @serializable public surname: string
    @serializable public socketid: string

    constructor(surname: string, socketid: string){
        this.surname = surname
        this.socketid = socketid
    }
}