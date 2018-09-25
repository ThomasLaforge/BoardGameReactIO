import { PropositionCard } from "./PropositionCard";

export class SentenceCard {

    public sentences: string[]

    constructor(sentences: string[]){
        this.sentences = sentences
    }

    get content(){
        const blankContent = '____________'
        let content = ''

        // add sentences
        this.sentences.forEach( s => {
            content += s || blankContent + ' '
        })

        return content.trim()
    }

    getNbBlank(){
        return this.sentences.filter(s => s === null).length
    }

    isComplete(propositions: PropositionCard[]){
        return this.getNbBlank() === propositions.filter(p => p !== null).length
    }

}