import { observable } from 'mobx';
import { Router } from '../Router/Router';

export class UIStore {
    
    @observable public router: Router;
    @observable public selectedTypeIndex: number
    @observable public username: string

	constructor(games?: any[]){
        this.router = new Router(games)
        this.selectedTypeIndex = null
    }
    
    currentFormComponent(){
        return this.selectedTypeIndex === null
    }
    handleChangeSelectedTypeIndex = (newIndex: number) => {
        this.selectedTypeIndex = newIndex
    }
	
}