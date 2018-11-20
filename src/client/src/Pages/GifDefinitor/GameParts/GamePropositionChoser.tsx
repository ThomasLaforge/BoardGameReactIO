import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif';
import { Input, Button } from '@material-ui/core';
import { prefix } from 'limitelimite-common/GifDefinitor/GifDefinitor';
import Proposition from '../components/Proposition';

interface GamePropositionChoserProps extends DefaultProps {
    gifUrl: string
    propositions: string[]
    handleVote: Function
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

    selectProposition = (index: number) => {
        this.setState({
            propostionChoice: (this.state.propostionChoice === index) ? null : index
        })
    }

    renderPropositions(){
        return this.props.propositions.map( (p, k) => 
            <Proposition 
                className="props-list-elt"
                onClick={() => this.selectProposition(k)}
                content={p}
            /> 
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
                        onClick={() => this.props.handleVote(this.state.propostionChoice)}
                    >Send</Button>
                </div>
            </div>
        );
    }
}

export default GamePropositionChoser;
