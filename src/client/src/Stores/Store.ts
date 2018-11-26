import {observable} from 'mobx'

import { UIStore } from './UIStore';

export class Store {

    @observable public uiStore: UIStore;

    constructor(games?: any[]){
		this.uiStore = new UIStore(games)
    }
    
}