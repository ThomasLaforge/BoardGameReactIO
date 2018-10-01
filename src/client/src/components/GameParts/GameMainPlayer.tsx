import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

interface GameMainPlayerProps extends DefaultProps {
    sentence: any
    propositions: any
}
interface GameMainPlayerState {
}

@inject(injector)
@observer
@socketConnect
class GameMainPlayer extends React.Component <GameMainPlayerProps, GameMainPlayerState> {

    constructor(props: GameMainPlayerProps){
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

export default GameMainPlayer;
