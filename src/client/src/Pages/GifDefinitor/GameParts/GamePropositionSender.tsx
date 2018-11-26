import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif/Gif';
import { Input, Button } from '@material-ui/core';
import { prefix } from 'limitelimite-common/GifDefinitor/GifDefinitor';
import Proposition from '../components/Proposition/Proposition';

interface GamePropositionSenderProps extends DefaultProps {
    gifUrl: string
    handleSendProp: Function
    hasSendProp: boolean
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

    render() {
        return (
            <div className="game-prop">
                <div className="game-prop-gif">
                    <Gif url={this.props.gifUrl} />
                </div>
                
                {!this.props.hasSendProp ? 
                    <div className="game-prop-form">
                        <div className="game-prop-input">
                            <Input 
                                value={this.state.propostion} 
                                onChange={this.updateInput}
                                fullWidth
                            />
                        </div>
                        <div className="game-prop-send-submit">
                            <Button 
                                variant='raised'
                                className="game-prop-send-btn"
                                onClick={() => this.props.handleSendProp(this.state.propostion)}
                                disabled={this.props.hasSendProp}
                            >Send</Button>
                        </div>
                    </div>
                : 
                    <div className="game-prop-sent">
                        <Proposition content={this.state.propostion} />
                    </div>
                }
                
                <div className='game-infos-zone'>
                    {this.props.hasSendProp 
                        ? 'Please wait other players send their proposition...'
                        : 'Enter your proposal, then submit it when you are happy with it!'
                    }
                </div>
            </div>
        );
    }
}

export default GamePropositionSender;
