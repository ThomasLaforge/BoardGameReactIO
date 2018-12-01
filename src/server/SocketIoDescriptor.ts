import { ExtendedSocket } from "./Server";

export class SocketIoDescriptor {

    public io: SocketIO.Server

    constructor(io: SocketIO.Server){
        this.io = io
    }

    get allUsernames(): string[] {
        return Object.keys(this.io.sockets.sockets).map(socketid => {
            let socket = this.io.sockets.sockets[socketid]
            return (socket as ExtendedSocket).username
        })
    }

}