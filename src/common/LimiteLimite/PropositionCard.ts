import {serializable} from 'serializr'

export class PropositionCard {

    @serializable private _content: string

    constructor(content: string){
        this._content = content
    }

    get content(){
        return this._content.charAt(0).toUpperCase() + this._content.slice(1);
    }

}