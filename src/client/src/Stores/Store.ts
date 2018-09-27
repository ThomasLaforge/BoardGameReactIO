import {observable} from 'mobx'

import { UIStore } from './UIStore';

export class Store {

    @observable public uiStore: UIStore;

    constructor(){
		this.uiStore = new UIStore()
    }
    
}