import {GameAction, ActionHistory} from './ActionHistory';

export class History {

    private _arrAction:Array<ActionHistory>;

    constructor(stringifiedSavedHistory?:string){
        if( stringifiedSavedHistory ) {
            this.load(stringifiedSavedHistory);
        }
        else{
            this.init();
        }
    }

    add(action:ActionHistory){
        this.arrAction.push(action);
    }

    undo(){
        this.arrAction.pop();
    }
    
    readAll(){
        this.arrAction.forEach(action => {
            if( !action.isSafe() ){
                return false;
            }
        });
        return true;
    }
    
    load(stringifiedSavedHistory:string){
        this.arrAction = JSON.parse(stringifiedSavedHistory);        
    }
    
    save(){
        console.log(JSON.stringify(this._arrAction));
    }

    reset(){
        this.arrAction = [];
    }

    init(){
        this.reset();
    }

    /**
     * Getters / Setters
     */
	private get arrAction(): Array<ActionHistory> {
		return this._arrAction;
	}
	private set arrAction(value: Array<ActionHistory>) {
		this._arrAction = value;
	}

}