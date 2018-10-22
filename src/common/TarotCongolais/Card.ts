import { ExcuseValue, EXCUSE_VALUE_LOW, EXCUSE_VALUE_HIGH } from './TarotCongolais'

export class Card {
    
    public value:number;

    constructor(value:number) {
        this.value = value;
    }

    choseExcuseValue(val: ExcuseValue){
        this.value = val === ExcuseValue.HIGH ? EXCUSE_VALUE_HIGH : EXCUSE_VALUE_LOW
    }

    isExcuse(){
        return this.value === -1 || this.value === 0 || this.value === 22
    }
    
}