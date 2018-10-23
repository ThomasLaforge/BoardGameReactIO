import { Socket, Namespace } from "socket.io";
import { SocketPlayer } from "../common/modules/SocketPlayer";
import { Player } from "../common/modules/Player";
import { LimiteLimiteGame } from "../common/modules/LimiteLimiteGame";
import { GameTypeClass } from "../common";

export interface ExtendedSocket extends Socket {
    username: string;
    socketPlayer: SocketPlayer;
    player: Player;
}

export interface ExtendedNamespace extends Namespace {
    game: GameTypeClass
}