import {Player} from './Player';
import {DEFAULT_NB_PLAYER} from './TarotCongolais'
import * as Utils from './utils';
import * as  _ from 'lodash';

export class PlayerCollection {

    private _arrPlayers:Array<Player>;
    private _arrReadyPlayers:Array<Player>;
    private _indexFirstPlayer:number;
    private _maxNbPlayer:number;

	constructor(maxNbPlayer = DEFAULT_NB_PLAYER, arrPlayers: Array<Player> = new Array(maxNbPlayer).fill(null), indexFirstPlayer = 0, arrReadyPlayers: Array<Player> = []) {
        this.indexFirstPlayer = indexFirstPlayer;
        this.arrPlayers = arrPlayers;
        this.maxNbPlayer = maxNbPlayer;
        this.arrReadyPlayers = arrReadyPlayers;
	}

    addPlayer(p: Player){
        if( !this.isOnCollection(p) ) {
            // Todo: Check if collection not already full
            let freeIndexes: Array<number> = [];
            this.arrPlayers.map((elt, index) => {
                if (!elt) {
                    freeIndexes.push(index)
                }
            } );
            let randomFreeIndex = freeIndexes[Math.floor(Math.random() * freeIndexes.length)];
            this.arrPlayers[randomFreeIndex] = p;
        }
        else{
            console.log('player already in collection')
        }
    }

    addReadyPlayer(p: Player){
        if( !this.isPlayerReady(p) && this.isOnCollection(p) ) {
            this.arrReadyPlayers.push(p);
        }
    }

    shuffle(){
        Utils.shuffle(this.arrPlayers);
    }

    getPlayers():Array<Player> {
        return this.arrPlayers.filter((p:Player) => {
            return p
        });
    }
    // get players ordered with player on parameter.
    getPlayersPOV(p: Player) : Player[] {
        let players = this.getPlayers()
        let playersOrdered = players.slice(players.indexOf(p)).concat(players.slice(0, players.indexOf(p)))
        return playersOrdered
    }

    getNames():Array<string> {
        let res:Array<string> = [];

        this.getPlayers().forEach( p => {
            res.push(p.username);
        });

        return res;
    }

    getFirstPlayer() {
        return this.getPlayers()[ this.indexFirstPlayer ];
    }

    changeFirstPlayer() {
        this.indexFirstPlayer = (this.indexFirstPlayer + 1) % this.getNbPlayer(); 
    }

    getNbPlayer() {
        return this.getPlayers().length;
    }

    remove(p: Player) {
        let idPlayer = this.getPlayerIndex(p);
        this.arrPlayers.splice(idPlayer,1);
    }

    getLeftPlayer(player: Player) : Player {
        let playerId:number = this.getPlayerIndex(player);
        if(playerId == -1){
            throw new Error('player not in collection');
        }
        let leftPlayerId:number = Math.abs( playerId - 1 + this.getNbPlayer() ) % this.getNbPlayer();
        return this.arrPlayers[ leftPlayerId ];
    }

    getFacePlayer(player: Player) {
        let playerId:number = this.getPlayerIndex(player);
        if(playerId == -1){
            throw new Error('player not in collection');
        }
        //Todo : If nb player = 4
        let leftPlayerId:number = Math.abs( playerId - 2 + this.getNbPlayer() ) % this.getNbPlayer();
        return this.arrPlayers[ leftPlayerId ];
    }

    getRightPlayer(player: Player) : Player {
        let playerId:number = this.getPlayerIndex(player);
        if(playerId == -1){
            throw new Error('player not in collection');
        }
        let rightPlayerId:number = (playerId + 1) % 4;
        return this.arrPlayers[ rightPlayerId ];
    }

    getPlayerIndex(player: Player): number {
        let res: number = -1;

        this.arrPlayers.forEach( (p, index) => {
            if( _.isEqual(p, player)){
                res = index;
            }
        });

        return res;
    }

    isFull(): boolean {
        return this.getPlayers().length >= this.maxNbPlayer
    }

    areAllPlayersReady(): boolean {
        return this.arrReadyPlayers.length === this.maxNbPlayer
    }

    isOnCollection(p: Player) {
        return this.arrPlayers.indexOf(p) !== -1
    }
    
    isPlayerReady(p: Player) {
        return this.arrReadyPlayers.indexOf(p) !== -1
    }

    /**
    * Getters / Setters
    */
	public get arrPlayers(): Array<Player> {
		return this._arrPlayers;
	}
	public set arrPlayers(value: Array<Player>) {
		this._arrPlayers = value;
	}
	public get indexFirstPlayer(): number {
		return this._indexFirstPlayer;
	}
	public set indexFirstPlayer(value: number) {
		this._indexFirstPlayer = value;
	}
	public get maxNbPlayer(): number {
		return this._maxNbPlayer;
	}
	public set maxNbPlayer(value: number) {
		this._maxNbPlayer = value;
	}
	public get arrReadyPlayers(): Array<Player> {
		return this._arrReadyPlayers;
	}
	public set arrReadyPlayers(value: Array<Player>) {
		this._arrReadyPlayers = value;
	}    
    
}