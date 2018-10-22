import { Player } from './Player'
import { Card } from './Card'

export const DEFAULT_NB_PLAYER = 2;
export const EXCUSE_VALUE_LOW = 0;
export const EXCUSE_VALUE_HIGH = 22;

export enum GameState {
    WaitingPlayers,
    WaitingToBeReady,
    WaitingPlayersToBeReady,
    InGame,
    WaitingPlayersToBet,
    Bet,
    WaitingPlayersToPlay,
    Play
}

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
    gameState?: GameState
}

export interface myPlayerInfos extends playerInfos {
    hand?: Card[],
    turnNbCard?: number
}