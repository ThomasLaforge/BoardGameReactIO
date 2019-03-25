import { Shape, Color, Filling } from "./definitions";
import { serializable } from "serializr";

export class Card {
    
    @serializable public shape: Shape
    @serializable public number: number
    @serializable public color: Color
    @serializable public filling: Filling

    constructor(shape: Shape, number: number, color: Color, filling: Filling){
        this.shape = shape
        this.number = number
        this.color = color
        this.filling = filling
    }

    isEqual(c: Card){
        return  c.color === this.color &&
                c.filling === this.filling &&
                c.shape === this.shape &&
                c.number === this.number
    }
}