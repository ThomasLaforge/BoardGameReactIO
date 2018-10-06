import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { Button } from '@material-ui/core';

interface GameBeforeStartProps extends DefaultProps {
    isCreator: boolean
    gameId: string
    nbPlayers: number
    startGame: Function
}
interface GameBeforeStartState {
}

@inject(injector)
@observer
@socketConnect
class GameBeforeStart extends React.Component <GameBeforeStartProps, GameBeforeStartState> {

    constructor(props: GameBeforeStartProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){

        }
    }

    render() {
        console.log('canStartGame', this.props.isCreator, this.props.nbPlayers > 1);
        
        const canStartGame = this.props.isCreator && this.props.nbPlayers > 1
        return (
            <div className="game-before-start">
                <h1>Before game start</h1>
                <div className="game-before-start-info">
                    {this.props.isCreator && this.props.nbPlayers === 1 && 'Waiting for more players'}
                    {!this.props.isCreator && 'Game creator will start the game when every player have joined. Wait a moment please.'}
                </div>
                {canStartGame && <Button onClick={() => {this.props.startGame()}}>Start the game</Button>}
            </div>
        );
    }
}

export default GameBeforeStart;
