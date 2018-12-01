export const NB_SECONDS_BEFORE_NEXT_TURN = 10

export interface GameLobbyListElt {
    people: string[]
    gameId: string
    isFull: boolean
}

export type GameLobbyList = GameLobbyListElt[]