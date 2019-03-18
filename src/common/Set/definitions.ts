import { Card } from "./Card";

export const prefix = 'set'

export const NB_DEFAULT_CARDS_ON_FIELD = 12
export const NB_CARDS_TO_ADD_ON_FIELD = 3
export const NB_CARDS_FOR_COMBINATION = NB_CARDS_TO_ADD_ON_FIELD

export enum Shape {
    Diamond,
    Wave,
    Line
}
export const SHAPES = [
    Shape.Diamond,
    Shape.Wave,
    Shape.Line
]

export enum Color {
    Red,
    Purple,
    Green
}
export const COLORS = [
    Color.Red,
    Color.Purple,
    Color.Green
]

export enum Filling {
    Full,
    Empty,
    Striped
}
export const FILLINGS = [
    Filling.Full,
    Filling.Empty,
    Filling.Striped
]

export const NUMBERS = new Array(3).fill('').map((e, i) => i + 1)

let defaults_cards: Card[] = []
SHAPES.forEach(s => {
COLORS.forEach(c => {
NUMBERS.forEach(n => {
FILLINGS.forEach(f => {
    defaults_cards.push( new Card(s, n, c, f) )
})})})})
export const DEFAULTS_CARDS = defaults_cards

export enum CardProperty {
    Shape = 'shape',
    Number = 'number',
    Filling = 'filling',
    Color = 'color'
}