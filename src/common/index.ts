export * from './LimiteLimite'
export * from './Server'
export * from './LimiteLimiteUI'
export * from './modules/Deck'
export * from './modules/GameCollection'
export * from './modules/Hand'
export * from './modules/LimiteLimiteGame'
export * from './modules/Player'
export * from './modules/PropositionCard'
export * from './modules/SentenceCard'
export * from './modules/SocketPlayer'
export * from './LimiteLimiteUI'

import { LimiteLimiteGame } from './modules/LimiteLimiteGame' 
import { Game as TarotCongolaisGame } from './TarotCongolais/Game'
import { MultiplayerGame } from './modules/MultiplayerGame';
import { SoloGame } from './modules/SoloGame';

export enum GameType {
    LimiteLimite,
    TarotCongolais
}

export const getGameClass = (gameType: GameType) : GameClass => {
    switch (gameType) {
        case GameType.LimiteLimite:
            return LimiteLimiteGame
        case GameType.TarotCongolais:
            return TarotCongolaisGame
        default:
            throw Error('try to get class of game type who doesn\'t exist')
    }
}

export type GameClass = any

export type GameTypeClass = MultiplayerGame | SoloGame