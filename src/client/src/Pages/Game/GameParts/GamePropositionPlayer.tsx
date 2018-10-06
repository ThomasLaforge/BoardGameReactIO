import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import SentenceCard from '../../../components/Cards/SentenceCard';
import PropositionCard from '../../../components/Cards/PropositionCard';
import { SentenceCard as SentenceCardModel, PropositionCard as PropositionCardmodel, Hand } from 'limitelimite-common';
import { serialize } from 'serializr';

interface GamePropositionPlayerProps extends DefaultProps {
    sentence: SentenceCardModel
    hand: Hand
}
interface GamePropositionPlayerState {
}

@inject(injector)
@observer
@socketConnect
class GamePropositionPlayer extends React.Component <GamePropositionPlayerProps, GamePropositionPlayerState> {

    constructor(props: GamePropositionPlayerProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){
            // this.props.socket.on('login_accepted', (username) => {})
        }
    }

    sendProposition = (propCard: PropositionCard) => {
        this.props.socket.emit('game:send_prop', serialize(propCard))
    }

    renderHand(){
        return this.props.hand.cards.map( (propCard:PropositionCardmodel, k) => 
            <PropositionCard 
                key={k}
                propositionCard={propCard} 
                onClick={this.sendProposition}
            />
        )
    }

    render() {
        return (
            <div className="game-prop-player">
                <h2>Other player</h2>
                <div className="sentence">
                    <SentenceCard 
                        sentenceCard={this.props.sentence}
                    />
                </div>
                <div className="hand">
                    {this.renderHand()}
                </div>
            </div>
        );
    }
}

export default GamePropositionPlayer;
