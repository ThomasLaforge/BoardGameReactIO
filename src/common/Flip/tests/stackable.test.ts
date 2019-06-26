import { Card } from "../Card";

describe('flip stackable', () => {

    test('same value', () => {
        let card1 = new Card(1, 0)
        let card1Bis = new Card(1, 4)
        expect(card1.isStackable(card1Bis)).toBe(false);
    })

    test('stackable bottom', () => {
        let card1 = new Card(10, 0)
        let card1Bis = new Card(9, 4)
        expect(card1.isStackable(card1Bis)).toBe(true);
    })

    test('stackable top', () => {
        let card1 = new Card(9, 0)
        let card1Bis = new Card(10, 4)
        expect(card1.isStackable(card1Bis)).toBe(true);
    })

    test('stackable extreme bottom', () => {
        let card1 = new Card(1, 0)
        let card1Bis = new Card(13, 4)
        expect(card1.isStackable(card1Bis)).toBe(true);
    })
    
    test('stackable extreme top', () => {
        let card1 = new Card(13, 0)
        let card1Bis = new Card(1, 4)
        expect(card1.isStackable(card1Bis)).toBe(true);
    })
})