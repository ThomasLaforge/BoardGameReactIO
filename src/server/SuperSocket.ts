import { Socket } from "socket.io";

export class SuperSocket {

    public socket: Socket
    public username?: string

    constructor(socket: Socket, username?: string){
        this.socket = socket
        this.username = username
    }

    on(action: string, listener: (...argsListener: any[]) => void){
        this.socket.on(action, (...args) => {
            console.log(this.username || this.socket.id ,' receive : ', action)
            listener(...args)
        })
    }

    emit(messageType: string, ...data: any[]){
        console.log(this.username || this.socket.id ,' send : ', messageType)
        return this.socket.emit(messageType, ...data)
    }

    get id(){
        return this.socket.id
    }
}