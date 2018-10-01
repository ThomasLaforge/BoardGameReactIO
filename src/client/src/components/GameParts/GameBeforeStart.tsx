import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import { Button } from '@material-ui/core';

interface GameBeforeStartProps extends DefaultProps {
    isFirstPlayer: boolean
    isCreator: boolean
    gameId: string
    nbPlayers: number
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
        const canStartGame = this.props.isCreator && this.props.nbPlayers > 1
        return (
            <div className="game-before-start">
                <h1>Before game start</h1>
                {canStartGame && <Button onClick={() => {}}>Start the game</Button>}
            </div>
        );
    }
}

export default GameBeforeStart;
