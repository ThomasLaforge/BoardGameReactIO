export const DEFAULT_IS_PRIVATE_GAME = false

export const NB_CARD_IN_HAND = 6

export enum GameStatus {
    Preparing,
    InGame,
    Finished
}

export interface GameLobbyListElt {
    people: string[]
    gameId: string
    isFull: boolean
}

export type GameLobbyList = GameLobbyListElt[]