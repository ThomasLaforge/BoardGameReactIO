import {Hand} from './Hand';
import {Card} from './Card';
import { DEFAULT_START_PV } from './TarotCongolais';

export class Player  {

    private _username:string;
	private _socketid:string;
	private _hand:Hand;
	private _pv:number;

    constructor( username:string, socketid: string, hand = new Hand(), pv:number = DEFAULT_START_PV ){
        this._username 	= username;
		this._hand		= hand;
		this._pv		= pv;
		this._socketid	= socketid;
    }

	losePV(nbPV = 1){
		this.pv -= nbPV
	}

	winPv(nbPV = 1){
		this.pv += nbPV
	}

	addCard(card: Card[]){
		this.hand.addCards(card)
	}

	playCard(card: Card){
		this.hand.playCard(card)
	}

	isEqual(p: Player){
		return p.socketid === this.socketid
	}

	/**
	 * Getters / Setters
	 */
	public get username(): string {
		return this._username;
	}
	public set username(value: string) {
		this._username = value;
	}
	public get hand(): Hand {
		return this._hand;
	}
	public set hand(value: Hand) {
		this._hand = value;
	}
	public get pv(): number {
		return this._pv;
	}
	public set pv(value: number) {
		this._pv = value;
	}
	public get socketid(): string {
		return this._socketid;
	}
	public set socketid(value: string) {
		this._socketid = value;
	}
		
	

}