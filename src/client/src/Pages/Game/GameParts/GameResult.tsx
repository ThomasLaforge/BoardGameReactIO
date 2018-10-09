import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { SentenceCard as SentenceCardModel, PropositionCard as PropositionCardModel, NB_SECONDS_BEFORE_NEXT_TURN } from 'limitelimite-common';

console.log('timer init', NB_SECONDS_BEFORE_NEXT_TURN)

import SentenceCard from '../../../components/Cards/SentenceCard'
import PropositionCard from '../../../components/Cards/PropositionCard'
import Timer from '../../../components/Timer';

interface GameResultProps extends DefaultProps {
    sentence: SentenceCardModel
    propositions: PropositionCardModel[][]
    chosenPropositionIndex: number
    isFirstPlayer: boolean
    winnerPlayerName: string
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

    renderPropositions(){
        console.log('props', this.props.propositions)
        return this.props.propositions.map( (props, k) => 
            <div 
                key={k}
                className="player-propositions" 
                onClick={() => this.props.isFirstPlayer && this.props.socket.emit('game:end_turn', k) } 
            >
                {props.map( (p, k2) => <PropositionCard 
                    key={k2}
                    className={this.props.chosenPropositionIndex === k ? 'chosen-prop' : ''} 
                    propositionCard={p}
                />
                )}
            </div>
        )
    }

    render() {
        return (
            <div className="game-result">
                <div className="game-result-sentence">
                    <SentenceCard sentenceCard={this.props.sentence} />
                </div>
                <div className="game-result-propositions">
                    {this.renderPropositions()}
                </div>

                <div className="game-result-indication">
                    { (!this.props.chosenPropositionIndex && this.props.chosenPropositionIndex !== 0)
                        ? this.props.isFirstPlayer 
                            ? 'Chose your favorite proposition' 
                            : 'Waiting for boss to chose a card'
                        :
                            [ this.props.winnerPlayerName + ' won this turn.',
                                <Timer duration={NB_SECONDS_BEFORE_NEXT_TURN}/>
                            ]
                    }
                </div>
            </div>
        );
    }
}

export default GameResult;
