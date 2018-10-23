import {Player} from './modules/Player'

export interface PlayerListUIElt {
    name: string,
    score: number,
    isFirstPlayer: boolean
    hasPlayed: boolean
}

export type PlayerListUI = PlayerListUIElt[] 

export const NB_SECONDS_BEFORE_NEXT_TURN = 10