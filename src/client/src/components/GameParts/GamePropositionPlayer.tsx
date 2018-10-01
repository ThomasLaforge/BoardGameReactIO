import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

interface GamePropositionPlayerProps extends DefaultProps {
    sentence: any
    hand: any
}
interface GamePropositionPlayerState {
}

@inject(injector)
@observer
@socketConnect
class GamePropositionPlayer extends React.Component <GamePropositionPlayerProps, GamePropositionPlayerState> {

    constructor(props: GamePropositionPlayerProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){
            // this.props.socket.on('login_accepted', (username) => {})
        }
    }

    render() {
        return (
            <div className="">
            </div>
        );
    }
}

export default GamePropositionPlayer;
