import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

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

    render() {
        return (
            <div className='limitelimite-creation-form'>
                Limite Limite Form
            </div> 
        );
    }
}

export default GameForm;
