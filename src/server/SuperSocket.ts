import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
    username: string;
}

export class SuperSocket {

    public socket: ExtendedSocket

    constructor(socket: ExtendedSocket){
        this.socket = socket
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

    get username(){ return this.socket.username}
    set username(username: string){ this.socket.username = username }

    get id(){
        return this.socket.id
    }
}