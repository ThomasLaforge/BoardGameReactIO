import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'

interface GameBeforeStartProps extends DefaultProps {
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
        console.log('uri params' , this.props.ui.router.getAllParams())
        if(this.props.socket){
            // this.props.socket.on('login_accepted', (username) => {})
        }
    }

    render() {
        return (
            <div className="game-before-start">
            </div>
        );
    }
}

export default GameBeforeStart;
