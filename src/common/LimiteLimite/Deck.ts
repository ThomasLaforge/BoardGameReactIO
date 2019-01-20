import { serializable, list, object, deserialize } from 'serializr';
import { PropositionCard } from './PropositionCard';
import { SentenceCard } from './SentenceCard';
import { CollectionDeckFamily } from './LimiteLimite';

export abstract class Deck<T> {

    public cards: T[];

	constructor(cards: T[], shuffle = true) {
        this.cards = cards
        if(cards.length === 0){
            this.load()
        }
        shuffle && this.shuffle()
    }

    abstract load(json?: any[]): void

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

    get firstCard(){
        return this.cards[0]
    }

}

export class PropositionDeck extends Deck<PropositionCard> {

    @serializable(list(object(PropositionCard))) public cards: PropositionCard[] = this.cards

    constructor(cards: PropositionCard[] = []){
        super(cards)
    }

    load(json: any[] = require('./datas/propositions/limitelimitelimite.json')){
        let cards = deserialize(PropositionCard, json)
        this.cards = cards
    }

    loadV2(decks: CollectionDeckFamily[] = []){
        let json = require('./datas/propositions/limitelimitelimite.json')
        let cards: PropositionCard[] = deserialize(PropositionCard, json)
        this.cards = cards
    }

}

export class SentenceDeck extends Deck<SentenceCard> {

    @serializable(list(object(SentenceCard))) public cards: SentenceCard[] = this.cards

    constructor(cards: SentenceCard[] = []){
        super(cards)
    }

    load(json: any[] = require('./datas/sentences/limitelimitelimite.json')){
        let cards = deserialize(SentenceCard, json)
        this.cards = cards
    }
}