import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif';
import { Input, Button } from '@material-ui/core';
import { prefix } from 'limitelimite-common/GifDefinitor/GifDefinitor';

interface GamePropositionChoserProps extends DefaultProps {
    gifUrl: string
    propositions: string[]
}
interface GamePropositionChoserState {
    propostionChoice: number
}

@inject(injector)
@observer
@socketConnect
class GamePropositionChoser extends React.Component <GamePropositionChoserProps, GamePropositionChoserState> {

    constructor(props: GamePropositionChoserProps){
        super(props)
        this.state = {
            propostionChoice: null
        }
    }

    handleVote = () => {
        this.props.socket.emit(prefix + 'game:send-vote', this.state.propostionChoice)
    }

    selectProposition = (index: number) => {
        this.setState({
            propostionChoice: (this.state.propostionChoice === index) ? null : index
        })
    }

    renderPropositions(){
        return this.props.propositions.map( (p, k) => 
            <div 
                className="props-list-elt"
                onClick={() => this.selectProposition(k)}
            >{p}</div> 
        )
    }

    render() {
        return (
            <div className="game-vote">
                <div className="game-vote-gif">
                    <Gif url={this.props.gifUrl} />
                </div>
                <div className="game-vote-props-list">
                    {this.renderPropositions()}
                </div>
                <div className="game-prop-send-btn">
                    <Button 
                        onClick={this.handleVote}
                    >Send</Button>
                </div>
            </div>
        );
    }
}

export default GamePropositionChoser;
