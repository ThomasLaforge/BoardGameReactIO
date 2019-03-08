import { Player } from "./Player";
import { DEFAULT_TURN_DURATION, ConceptType } from "./defs";
import { Concept } from "./Concept";

export class Turn {

    public master: Player
    public sentence: string
    public winner?: Player
    public startDate: Date
    public endDate?: Date
    public duration: number
    public conceptList: Concept[]

    constructor(master: Player, sentence: string, conceptList: Concept[] = [], duration = DEFAULT_TURN_DURATION, startDate = new Date()){
        this.master = master
        this.sentence = sentence
        this.startDate = startDate
        this.duration = duration
        this.conceptList = conceptList
    }

    addConcept(concept: Concept){
        const indexOfConceptColor = this.conceptList.findIndex(c => c.color === concept.color)
        const indexToAddConcept = indexOfConceptColor === -1 ? this.conceptList.length : indexOfConceptColor
        this.conceptList[indexToAddConcept] = concept
    }

    addWinner(winner: Player){
        this.winner = winner
    }

    getScore(p: Player){
        let score = 0

        if(p.isEqual(this.master) && !!this.winner){
            score = 1
        }
        if(!!this.winner && p.isEqual(this.winner)){
            score = 2
        }

        return score
    }

    isTimeOver(){
        return new Date().getTime() - this.startDate.getTime() > this.duration
    }

    endTurn(winner?: Player){
        if(!!winner){
            this.addWinner(winner)
        }
        this.endDate = new Date()
    }

    isTurnComplete(){
        return !!this.winner || this.isTimeOver()
    }

}