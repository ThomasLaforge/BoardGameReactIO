import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

interface GameResultProps extends DefaultProps {
    sentence: any
    propositions: any
    chosenProposition: any
}
interface GameResultState {
}

@inject(injector)
@observer
@socketConnect
class GameResult extends React.Component <GameResultProps, GameResultState> {

    constructor(props: GameResultProps){
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

export default GameResult;
