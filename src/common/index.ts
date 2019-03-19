export * from './LimiteLimite/LimiteLimite'
export * from './modules/Server'
export * from './UI'
export * from './LimiteLimite/Deck'
export * from './modules/GameCollection'
export * from './LimiteLimite/Hand'
export * from './LimiteLimite/LimiteLimiteGame'
export * from './LimiteLimite/Player'
export * from './LimiteLimite/PropositionCard'
export * from './LimiteLimite/SentenceCard'
export * from './modules/SocketPlayer'
export * from './UI'

import { LimiteLimiteGame } from './LimiteLimite/LimiteLimiteGame' 
import { Game as TarotCongolaisGame } from './TarotCongolais/Game'
import { Game as GifDefinitor } from './GifDefinitor/Game'
import { Game as SetGame } from './GifDefinitor/Game'
import { MultiplayerGame } from './modules/MultiplayerGame';
import { SoloGame } from './modules/SoloGame';
import { Client } from './modules/Client';
import { Server } from './modules/Server';

export const getGameClass = (gameName: string) : GameClass => {
    switch (gameName) {
        case 'limitelimite':
            return LimiteLimiteGame
        case 'tarotcongolais':
            return TarotCongolaisGame
        case 'gifdefinitor':
            return GifDefinitor
        case 'set':
            return SetGame
        default:
            throw Error('try to get class of game type who doesn\'t exist')
    }
}

export type GameClass = any

export type GameTypeClass = MultiplayerGame | SoloGame

export interface GameModule {
    identifier: string,
    client: Client,
    server: Server
}