import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import { Button } from '@material-ui/core';

interface GameResultProps extends DefaultProps {
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

    render() {
        return (
            <div className="game-over">
                Game Over !
            </div>
        );
    }
}

export default GameResult;
