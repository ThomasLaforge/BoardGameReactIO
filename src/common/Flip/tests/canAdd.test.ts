import { SocketPlayer } from "../../modules/SocketPlayer";
import { Game } from "../Game";
import { Deck } from "../Deck";
import { Card } from "../Card";

describe('can add', () => {

    const players = [
        new SocketPlayer('toto', 'totoid'),
        new SocketPlayer('tata', 'tataid')
    ]
    const initGameCards = [
        new Card(2, 0),
        new Card(2, 0)
    ]
    const notAddableDeck = new Deck([
        new Card(2, 0),
        new Card(2, 0),
        new Card(2, 0),
        new Card(2, 0),
        new Card(2, 0)
    ])
    
    test('player can add on stack', () => {
        let flipGame = new Game(players, new Deck(initGameCards.slice()))
        flipGame.players.forEach(p => {
            p.deck = notAddableDeck
        })
        expect(flipGame.canAddCards()).toEqual(false)
    })
    test('player cant add on stack', () => {
        let flipGame = new Game(players, new Deck(initGameCards.slice()))
        flipGame.players.forEach(p => {
            p.deck = notAddableDeck
        })
        expect(flipGame.cantAddCards()).toEqual(true)
    })
    
    const addableDeck = new Deck([
        new Card(1, 1),
        new Card(1, 1),
        new Card(1, 1),
        new Card(1, 1),
        new Card(1, 1),
        new Card(1, 1),
    ])
    test('player can add on stack', () => {
        let flipGame = new Game(players, new Deck(initGameCards.slice()))
        flipGame.players.forEach(p => {
            p.deck = addableDeck
        })
        expect(flipGame.canAddCards()).toEqual(true)
    })
    test('player cant add on stack', () => {
        let flipGame = new Game(players, new Deck(initGameCards.slice()))
        flipGame.players.forEach(p => {
            p.deck = addableDeck
        })
        expect(flipGame.cantAddCards()).toEqual(false)
    })
})