import {Card} from './Card';

export class Deck {

    public arrayDeck: Card[];

    constructor(arrayDeck?: Card[], shuffle = true) {
        this.arrayDeck = []

        if(arrayDeck){
            this.arrayDeck = arrayDeck
        }
        else {
            console.log('shuffle', shuffle)
            this.initDeck(shuffle)
        }
    }

    initDeck(shuffle = true):void {
        this.arrayDeck = [];
        // add excuse
        this.addCard( -1 );
        // add trumps
        for (let value = 1; value <= 21; value++) {
            this.addCard( value );
        }
        shuffle && this.shuffle()
    }
    reset() {
        this.initDeck()
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

    addCard(card:Card|number){
        if( !(card instanceof Card) ){ 
            card = new Card(card)
        }
        this.arrayDeck.push(card);
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

    get length(){
        return this.arrayDeck.length
    }

}