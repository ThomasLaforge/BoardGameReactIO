import { Card } from "../Card";
import { Shape, Color, Filling, CardProperty } from "../definitions";
import { Combination } from "../Combination";

describe('combination', () => {
    const cardsWithAllDifferentsProperties = [
        new Card(Shape.Diamond, 1, Color.Purple, Filling.Empty),
        new Card(Shape.Line, 2, Color.Green, Filling.Full),
        new Card(Shape.Wave, 3, Color.Red, Filling.Striped)
    ]

    const cardsWithAllSameProperties = [
        new Card(Shape.Diamond, 1, Color.Purple, Filling.Empty),
        new Card(Shape.Diamond, 1, Color.Purple, Filling.Empty),
        new Card(Shape.Diamond, 1, Color.Purple, Filling.Empty)
    ]

    describe('has all different properties', () => {
        const combination = new Combination(cardsWithAllDifferentsProperties)

        test('color', () => {
            expect(combination.hasAllDifferent(CardProperty.Color)).toBe(true)
        })
        
        test('number', () => {
            expect(combination.hasAllDifferent(CardProperty.Number)).toBe(true)
        })
        
        test('filling', () => {
            expect(combination.hasAllDifferent(CardProperty.Filling)).toBe(true)
        })
        
        test('shape', () => {
            expect(combination.hasAllDifferent(CardProperty.Shape)).toBe(true)
        })
    })

    describe('has all same properties', () => {
        const combination = new Combination(cardsWithAllSameProperties)

        test('color', () => {
            expect(combination.hasSame(CardProperty.Color)).toBe(true)
        })
        
        test('number', () => {
            expect(combination.hasSame(CardProperty.Number)).toBe(true)
        })
        
        test('filling', () => {
            expect(combination.hasSame(CardProperty.Filling)).toBe(true)
        })
        
        test('shape', () => {
            expect(combination.hasSame(CardProperty.Shape)).toBe(true)
        })
    })

    describe('is valid', () => {
        test('all differents', () => {
            const combination = new Combination(cardsWithAllDifferentsProperties)
            expect(combination.isValid()).toBe(true)
        })
    })
})