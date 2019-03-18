import { Deck } from "../Deck";

describe('set deck', () => {

    test('default length', () => {
        const deck = new Deck()
        expect(deck.length).toBe(3*3*3*3)
    })
    
})
