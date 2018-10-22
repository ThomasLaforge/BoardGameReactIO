import {Hand} from './Hand';
import {Card} from './Card';
import {PlayerInterface} from './TarotCongolais'

export class Player implements PlayerInterface {

    private _username:string;
	private _socketid:string;
	private _hand:Hand;
	private _pv:number;

    constructor( username:string, socketid: string, hand = new Hand(), pv:number = 10 ){
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

	addCard(card: Card | Card[]){
		this.hand.addCards(card)
	}

	playCard(card: Card | Card[]){
		this.hand.playCard(card)
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