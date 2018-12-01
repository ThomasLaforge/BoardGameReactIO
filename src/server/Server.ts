import { Socket, Namespace } from "socket.io";
import { SocketPlayer } from "../common/modules/SocketPlayer";
import { GameTypeClass } from "../common";

export interface ExtendedSocket extends Socket {
    username: string;
    socketPlayer: SocketPlayer;
}

export interface ExtendedNamespace extends Namespace {
    game: GameTypeClass
}