import {Player} from './Player'

export const prefix = 'gifdefinitor'
export const NB_SECONDS_BEFORE_NEXT_TURN = 6

export interface Vote {
    propositionIndex: number,
    voter: Player
}

export interface Proposition {
    player: Player,
    sentence: string
}

export enum WinConditionType {
    nb_point,
    nb_turn
}

export interface WinCondition {
    type: WinConditionType,
    value: number
}