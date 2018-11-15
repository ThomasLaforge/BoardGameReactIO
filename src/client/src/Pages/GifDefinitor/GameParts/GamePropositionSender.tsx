import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif';
import { Input, Button } from '@material-ui/core';
import { prefix } from 'limitelimite-common/GifDefinitor/GifDefinitor';

interface GamePropositionSenderProps extends DefaultProps {
    gifUrl: string
}
interface GamePropositionSenderState {
    propostion: string
}

@inject(injector)
@observer
@socketConnect
class GamePropositionSender extends React.Component <GamePropositionSenderProps, GamePropositionSenderState> {

    constructor(props: GamePropositionSenderProps){
        super(props)
        this.state = {
            propostion: ''
        }
    }

    updateInput = (e) => {
        this.setState({ propostion: e.target.value })
    }

    handleSendProp = () => {
        this.props.socket.emit(prefix + 'game:send-prop', this.state.propostion)
    }

    render() {
        return (
            <div className="game-prop">
                <div className="game-prop-gif">
                    <Gif url={this.props.gifUrl} />
                </div>
                <div className="game-prop-input">
                    <Input 
                        value={this.state.propostion} 
                        onChange={this.updateInput}
                    />
                </div>
                <div className="game-prop-send-btn">
                    <Button 
                        onClick={this.handleSendProp}
                    >Send</Button>
                </div>
            </div>
        );
    }
}

export default GamePropositionSender;
