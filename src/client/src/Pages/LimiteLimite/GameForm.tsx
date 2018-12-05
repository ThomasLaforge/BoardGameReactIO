import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import { Button } from '@material-ui/core';

interface GameFormProps extends DefaultProps {
}
interface GameFormState {

}

@inject(injector)
@observer
@socketConnect
class GameForm extends React.Component <GameFormProps, GameFormState> {

    constructor(props: GameFormProps){
        super(props)
        this.state = {
        }
    }

    onClickCreateGame = () => {
        this.props.socket.emit('lobby:create', 'limitelimite')
    }

    render() {
        return (
            <div className='limitelimite-creation-form'>
                <Button 
                    variant="raised"
                    onClick={this.onClickCreateGame}
                >Create a game</Button>
            </div> 
        );
    }
}

export default GameForm;
