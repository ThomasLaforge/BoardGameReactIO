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
    nbPlayersToStart: number
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
                <div className="game-before-start-infos">
                    {!this.props.isCreator 
                        ? [
                            'Game creator will start the game when every player have joined ( ' + this.props.nbPlayers + ' / ' + this.props.nbPlayersToStart + ' )',
                            <br />,
                            'Please, Wait a moment ...'
                        ]
                        : this.props.nbPlayers === this.props.nbPlayersToStart
                            ? [ 
                                'You are ' + this.props.nbPlayers + ' players in the game.',
                                <br />,
                                'You can now start to play',
                                <Button 
                                    variant='raised'
                                    className='start-game-btn'
                                    onClick={() => {this.props.startGame()}}
                                >
                                        Start
                                    </Button>
                                ]
                            : 'Waiting for more players ...'
                    }
                </div>
            </div>
        );
    }
}

export default GameBeforeStart;
