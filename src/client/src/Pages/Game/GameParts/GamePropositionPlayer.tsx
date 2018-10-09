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
            // remove oldest selected card index
            // selectedPropIndexes.shift()

            // remove latest selected card before this one
            selectedPropIndexes.splice(selectedPropIndexes.length - 1 - 1, 1)            
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

                <div className='chosen-props'>
                
                </div>

                <div className="hand">
                    {this.renderHand()}
                </div>

                <Button 
                    className={'send-button ' + (this.state.selectedPropIndexes.length !== this.nbCardToChose ? 'send-button-disabled' : '')}
                    variant='raised'
                    onClick={this.handleSendProps}
                    disabled={this.state.selectedPropIndexes.length !== this.nbCardToChose}
                >
                    Validate
                </Button>
                
                <div className="game-infos-zone">
                    You have to select {this.nbCardToChose} cards. You selected {this.state.selectedPropIndexes.length} cards.
                    {this.state.selectedPropIndexes.length === this.nbCardToChose && [<br/>, 'You can send your proposition']}
                </div>
            </div>
        );
    }
}

export default GamePropositionPlayer;
