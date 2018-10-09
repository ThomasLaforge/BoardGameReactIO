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
    selectedPropIndexes: number[]
}

@inject(injector)
@observer
@socketConnect
class GamePropositionPlayer extends React.Component <GamePropositionPlayerProps, GamePropositionPlayerState> {

    constructor(props: GamePropositionPlayerProps){
        super(props)
        this.state = {
            selectedPropIndexes: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            // this.props.socket.on('login_accepted', (username) => {})
        }
    }

    get nbCardToChose(){
        return this.props.sentence.getNbBlank()
    }

    sendProposition = (propCard: PropositionCard) => {
        this.props.socket.emit('game:send_prop', serialize(propCard))
    }

    selectProp = (propIndex: number) => {
        let selectedPropIndexes = this.state.selectedPropIndexes.includes(propIndex) 
                            ? this.state.selectedPropIndexes.filter(v => v !== propIndex)
                            : this.state.selectedPropIndexes.concat(propIndex)   
        if(selectedPropIndexes.length > this.nbCardToChose){
            selectedPropIndexes.shift()
        }
        this.setState({ selectedPropIndexes })
    }

    handleSendProps = () => {
        let propCards = this.state.selectedPropIndexes.map(index => this.props.hand.cards[index])
        this.props.socket.emit('game:send_prop', serialize(propCards))
    }

    renderHand(){
        return this.props.hand.cards.map( (propCard:PropositionCardmodel, k) => 
            <PropositionCard 
                key={k}
                className={this.state.selectedPropIndexes.includes(k) ? 'selected-proposition' : 'not-selected-proposition' }
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
                    disabled={this.state.selectedPropIndexes.length !== this.nbCardToChose}
                >
                    Validate
                </Button>
            </div>
        );
    }
}

export default GamePropositionPlayer;
