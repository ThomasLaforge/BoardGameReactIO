import { EXCUSE_VALUE_LOW, EXCUSE_VALUE_HIGH } from './TarotCongolais'

export class Card {
    
    private _value:number;

    constructor(value:number) {
        this._value = value;
    }

    choseExcuseValue(val: number){
        this._value = val === EXCUSE_VALUE_HIGH ? EXCUSE_VALUE_HIGH : EXCUSE_VALUE_LOW
    }

    isExcuse(){
        return this._value === -1 || this._value === EXCUSE_VALUE_LOW || this._value === EXCUSE_VALUE_HIGH
    }
    
    switchExcuseValue(){
        this._value = this._value === EXCUSE_VALUE_HIGH ? EXCUSE_VALUE_HIGH : EXCUSE_VALUE_LOW
    }

    get value(){
        return this._value === -1 ? EXCUSE_VALUE_HIGH : this._value
    }

    
}