import { ConceptType, ConceptColor } from "./defs";

export class Concept {

    public typeList: ConceptType[]
    public color: ConceptColor

    constructor(color: ConceptColor, typeList: ConceptType[]){
        if(typeList.length < 1){
            throw new Error('impossible to create a concept with empty type list')
        }
        else {
            this.typeList = typeList
        }
        this.color = color
    }

    
}