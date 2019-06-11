import {Card} from './Card';
import { NB_COLORS, NB_VALUES, DEFAULT_NB_PACKS } from './defs';

export class Deck {

    public arrayDeck: Card[]
    
    constructor(
        arrayDeck?: Card[],
        public nbPacks = DEFAULT_NB_PACKS
    ) {
        this.arrayDeck = []

        if(arrayDeck){
            this.arrayDeck = arrayDeck
        }
        else {
            this.initDeck();
        }
    }

    initDeck(shuffle = true):void {
        this.arrayDeck = []
        
        for (let i = 0; i < this.nbPacks; i++) {
            for (let color = 0; color < NB_COLORS; color++) {
                for (let value = 1; value <= NB_VALUES; value++) {
                    this.addCard(new Card(value, color))    
                }
            }
        }

        shuffle && this.shuffle();
    }
    reset() {
        this.initDeck();
    }

    // States of arrays : deck and discard

    isEmpty(){
        return this.arrayDeck.length <= 0;
    }

    getNbCards(){
        return this.arrayDeck.length;
    }

    shuffle(){
        this.arrayDeck = this.arrayDeck.sort(() => Math.random() - 0.5)
    }

    addCard(card:Card){
        this.arrayDeck.push(card);
    }
    addCards(cards: Card[]){
        this.arrayDeck = [...this.arrayDeck, ...cards]
    }

    addCardsToTheEnd(cards:Array<Card>){ 
        cards.forEach( card => {
            this.addCard(card)
        });
    }
    
    addCardOnTop(cards:Array<Card>){
        cards.forEach( card => {    
            this.arrayDeck.unshift(card)
        });
    }

    // Missing control if empty
    drawCards( nbCards:number ){
        let res: Card[] = [];
        for( let i=0; i < nbCards; i++ ){
            if(this.arrayDeck.length > 0){
                res.push( this.drawOneCard() );
            }
        }

        return res;
    }

    // Could be recursive ?
    drawOneCard(){
        let res:any = null;

        if ( !this.isEmpty() ) {
            res = this.arrayDeck[0];
            this.arrayDeck.splice( 0, 1 );
        }
        else {
          throw new Error('No more cards in this deck');
        }

        return res;
    }

    getAllCards() : Array<Card>{
        return this.arrayDeck;
    }

    getCopyOfCard(index: number){
        if(index < 0 || index > this.arrayDeck.length - 1){
            throw new Error('Try to get a card at index : ' + index + ' who doesn\'t exist in deck')
        }
        return this.arrayDeck[index]
    }

    removeCard(cardIndex: number){
        this.arrayDeck.splice(cardIndex, 1)
        // this.arrayDeck = this.arrayDeck.filter( (c, i) => i !== cardIndex)
    }

    get length(){
        return this.arrayDeck.length
    }

}