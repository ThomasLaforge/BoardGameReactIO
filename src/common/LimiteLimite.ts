import { SentenceCard } from "./modules/SentenceCard";
import { PropositionCard } from "./modules/PropositionCard";

const prefixSeparator = '-'
export const prefix = 'limitelimite' + prefixSeparator

export const DEFAULT_IS_PRIVATE_GAME = false
export const DEFAULT_NB_PLAYER = 0
export const NB_CARD_IN_HAND = 6
export const DEFAULT_NB_TURN = 10

export enum GameStatus {
    Preparing,
    InGame,
    Finished,
    Result
}

export interface GameLobbyListElt {
    people: string[]
    gameId: string
    isFull: boolean
}

export type GameLobbyList = GameLobbyListElt[]


export interface PropSent {
    playerIndex: number,
    prop: PropositionCard[]
}


export interface ITurn {
    sentence: SentenceCard,
    propositions: PropSent[]
}

export enum CollectionDeckFamily {
    LimiteLimite = 'limitelimite',
    LimiteLimiteLimite = 'limitelimitelimite'
}