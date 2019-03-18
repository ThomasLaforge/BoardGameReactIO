export class Player {

    constructor(public username:string, public socketid: string ){
        this.username 	= username;
		this.socketid	= socketid;
    }
    
    isEqual(p: Player){
        return this.socketid === p.socketid
    }
}