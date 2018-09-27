export enum GameStatus {
    Preparing,
    InGame,
    Finished
}

export interface GameLobbyListElt {
    people: string[]
    gameId: string
    state: GameStatus
}

export type GameLobbyList = GameLobbyListElt[]