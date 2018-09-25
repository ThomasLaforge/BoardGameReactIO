import {observable} from 'mobx'

export class Deck {

    @observable public cards: any[];

	constructor(cards: any[], shuffle = !cards) {
        this.cards = cards
    }

    pick(nb = 1){
        let cards = this.cards.slice()
        let cardsPicked = cards.splice(0, nb)
        this.cards = cards
        return cardsPicked
    }
    
    shuffle(){
        this.cards = this.cards.sort(() => Math.random() - 0.5)
    }

    length(){
        return this.cards.length
    }

}