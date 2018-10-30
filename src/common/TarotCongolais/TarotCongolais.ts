import { Player } from './Player'
import { Card } from './Card'

export const prefix = 'tarotcongolais-'

export const DEFAULT_NB_PLAYER = 4;
export const EXCUSE_VALUE_LOW = 0;
export const EXCUSE_VALUE_HIGH = 22;
export const DEFAULT_START_PV = 10;

export enum ExcuseValue {
    LOW,
    HIGH
}

export interface Bet {
	player: Player
	bet: number
}

export interface Play {
    player: Player;
    card: Card;
}

// ------------- //
// UI interfaces //
// ------------- //

export interface playerInfos {
    name?: string,
    pv?: number,
    betValue?: number,
    nbTricks?: number,
    cardPlayed?: Card,
    handLength?: number,
    gameState?: GamePhase
}

export interface myPlayerInfos extends playerInfos {
    hand?: Card[],
    turnNbCard?: number
}

export enum GamePhase {
    Bet = 1,
    Play = 2
}