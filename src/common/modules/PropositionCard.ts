import {serializable} from 'serializr'

export class PropositionCard {

    @serializable public content: string

    constructor(content: string){
        this.content = content.charAt(0).toUpperCase() + content.slice(1);
    }

}