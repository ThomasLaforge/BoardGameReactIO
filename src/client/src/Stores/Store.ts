import {observable} from 'mobx'

import { UIStore } from './UIStore';

export class Store {

    @observable public uiStore: UIStore;
    @observable public games: any[]

    constructor(games: any[]){
      this.uiStore = new UIStore(games)
      this.games = games
    }
    
}