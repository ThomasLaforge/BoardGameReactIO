import {Player} from './modules/Player'

export interface PlayerListUIElt {
    name: string,
    score: number,
    isFirstPlayer: boolean
}

export type PlayerListUI = PlayerListUIElt[] 
