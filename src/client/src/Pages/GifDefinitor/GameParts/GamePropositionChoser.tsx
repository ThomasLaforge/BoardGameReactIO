import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif/Gif';
import { Input, Button } from '@material-ui/core';
import { prefix } from 'boardgamereactio-common/GifDefinitor/GifDefinitor';
import Proposition from '../components/Proposition/Proposition';

interface GamePropositionChoserProps extends DefaultProps {
    gifUrl: string
    propositions: string[]
    handleVote: Function
    hasVotedProp: boolean
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
        console.log('choice', index)
        this.setState({
            propostionChoice: (this.state.propostionChoice === index) ? null : index
        })
    }

    renderPropositions(){
        return this.props.propositions.map( (p: any, k) => 
            <Proposition 
                className="props-list-elt"
                onClick={() => this.selectProposition(k)}
                content={p.sentence}
                selected={this.state.propostionChoice === k}
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
                        variant='raised'
                        onClick={() => this.props.handleVote(this.state.propostionChoice)}
                        disabled={this.props.hasVotedProp || this.state.propostionChoice === null}
                    >Send</Button>
                </div>
                <div className='game-infos-zone'>
                    {this.props.hasVotedProp 
                        ? 'Please wait other players send their vote...'
                        : 'Select the best proposal, then submit it when you are happy with it!'
                    }
                </div>
            </div>
        );
    }
}

export default GamePropositionChoser;
