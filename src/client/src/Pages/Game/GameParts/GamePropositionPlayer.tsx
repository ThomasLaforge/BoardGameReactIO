import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import SentenceCard from '../../../components/Cards/SentenceCard';
import PropositionCard from '../../../components/Cards/PropositionCard';
import { SentenceCard as SentenceCardModel, PropositionCard as PropositionCardmodel, Hand } from 'limitelimite-common';
import { serialize } from 'serializr';
import { Button } from '@material-ui/core';

interface GamePropositionPlayerProps extends DefaultProps {
    sentence: SentenceCardModel
    hand: Hand
}
interface GamePropositionPlayerState {
    selectedProps: number[]
}

@inject(injector)
@observer
@socketConnect
class GamePropositionPlayer extends React.Component <GamePropositionPlayerProps, GamePropositionPlayerState> {

    constructor(props: GamePropositionPlayerProps){
        super(props)
        this.state = {
            selectedProps: []
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

    selectProp = (propIndex: number) => {
        let selectedProps = this.state.selectedProps.includes(propIndex) 
                            ? this.state.selectedProps.filter(v => v !== propIndex)
                            : this.state.selectedProps.concat(propIndex)   
        this.setState({ selectedProps })
    }

    handleSendProps = () => {
        let propCards = []
        this.props.socket.emit('game:send_prop', serialize(propCards))
    }

    renderHand(){
        return this.props.hand.cards.map( (propCard:PropositionCardmodel, k) => 
            <PropositionCard 
                key={k}
                className={this.state.selectedProps.includes(k) ? 'selected-proposition' : 'not-selected-proposition' }
                propositionCard={propCard} 
                onClick={() => this.selectProp(k)}
            />
        )
    }

    render() {
        return (
            <div className="game-prop-player">
                <div className="sentence">
                    <SentenceCard 
                        sentenceCard={this.props.sentence}
                    />
                </div>
                <div className="hand">
                    {this.renderHand()}
                </div>

                <Button 
                    className='send-button'
                    onClick={this.handleSendProps}
                >
                    Validate
                </Button>
            </div>
        );
    }
}

export default GamePropositionPlayer;
