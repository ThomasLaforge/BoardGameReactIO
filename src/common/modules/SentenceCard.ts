import { PropositionCard } from "./PropositionCard";
import { serializable, list, primitive } from "serializr";

export class SentenceCard {

    @serializable(list(primitive())) public sentences: (string | null)[]

    constructor(sentences: (string | null)[]){
        this.sentences = sentences
    }

    get content(){
        const blankContent = ' ____________ '
        let content = ''

        // add sentences
        this.sentences.forEach( s => {
            content += s || blankContent + ' '
        })

        content = content.trim()
        return content.charAt(0).toUpperCase() + content.slice(1);
    }

    getNbBlank(){
        return this.sentences.filter(s => s === null).length
    }

    isComplete(propositions: PropositionCard[]){
        return this.getNbBlank() === propositions.filter(p => p !== null).length
    }

}