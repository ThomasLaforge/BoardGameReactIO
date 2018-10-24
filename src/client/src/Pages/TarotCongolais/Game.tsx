import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'

import { GameStatus, DEFAULT_IS_PRIVATE_GAME, SentenceCard, Hand, PropositionCard } from 'limitelimite-common';
import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import { ChatMessage } from 'limitelimite-common/Server';
// import { prefix } from 'limitelimite-common/LimiteLimite'

// console.log('prefix on render', prefix)

import Chat from '../../components/Chat';

// import './game.scss'

interface GameProps extends DefaultProps {
}
interface GameState {
}

@inject(injector)
@observer
@socketConnect
class Game extends React.Component <GameProps, GameState> {

    constructor(props: GameProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            // socket.emit(prefix + 'game:ask_initial_infos')

            // socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: PlayerListUI, isCreator: boolean, myIndex: number, initialChat: ChatMessage[]) => {
            //     console.log('players1', gameId, players, isCreator, myIndex, initialChat)
            //     this.setState({gameId, isCreator, players, myIndex })
            // })
        }
    }

    startGame = () => {
        // this.props.socket.emit(prefix + 'game:start')
    }

    render() {
        return (
            <div className='game'>
                Tarot Congolais
            </div>
        );
    }
}

export default Game;
