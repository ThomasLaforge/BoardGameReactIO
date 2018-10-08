import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { SentenceCard as SentenceCardModel, PropositionCard as PropositionCardModel } from 'limitelimite-common';

import SentenceCard from '../../../components/Cards/SentenceCard'
import PropositionCard from '../../../components/Cards/PropositionCard'

interface GameResultProps extends DefaultProps {
    sentence: SentenceCardModel
    propositions: PropositionCardModel[]
    chosenPropositionIndex: number
    isFirstPlayer: boolean
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

    // componentDidMount(){
    //     if(this.props.socket){            
    //     }
    // }

    renderPropositions(){
        return this.props.propositions.map( (p, k) => 
            <PropositionCard 
                key={k}
                className={this.props.chosenPropositionIndex === k ? 'chosen-prop' : ''} 
                propositionCard={p} 
                onClick={() => this.props.isFirstPlayer && this.props.socket.emit('game:end_turn', k) } 
            />
        )
    }

    render() {
        return (
            <div className="game-result">
                <h2>Game result</h2>
                <div className="game-result-sentence">
                    <SentenceCard sentenceCard={this.props.sentence} />
                </div>
                <div className="game-result-propositions">
                    {this.renderPropositions()}
                </div>
                <div className="game-result-indication">
                    {this.props.isFirstPlayer ? 'Chose your favorite proposition' : 'Waiting boss to chose a card'}
                </div>
            </div>
        );
    }
}

export default GameResult;
