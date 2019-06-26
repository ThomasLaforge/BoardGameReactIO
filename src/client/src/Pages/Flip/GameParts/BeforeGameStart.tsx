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
        console.log('canStartGame', this.props.isCreator, this.props.nbPlayers);
        
        return (
            <div className="game-before-start">
                <div className="game-before-start-infos">
                    {!this.props.isCreator 
                        ? <div>
                            Game creator will start the game when every player have joined.
                            <br />
                            Please, Wait a moment ...
                        </div>
                        : this.props.nbPlayers < 2
                            ? 'Waiting for more players ...'
                            : <div>
                                You are {this.props.nbPlayers} players in the game.
                                <br />
                                You can now start to play, or wait for new players.
                                <Button 
                                    variant='raised'
                                    className='start-game-btn'
                                    onClick={() => {this.props.startGame()}}
                                >
                                    Start
                                </Button>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default GameBeforeStart;
