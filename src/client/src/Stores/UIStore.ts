import { observable } from 'mobx';
import { Router } from '../Router/Router';

export class UIStore {
    
    @observable public router: Router;

	constructor(){
        this.router = new Router()
	}
	
}