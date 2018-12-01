import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import SentenceCard from '../../../components/Cards/SentenceCard';
import PropositionCard from '../../../components/Cards/PropositionCard';
import { SentenceCard as SentenceCardModel, PropositionCard as PropositionCardmodel, Hand } from 'boardgamereactio-common';
import { serialize } from 'serializr';
import { Button } from '@material-ui/core';
import { Fragment } from 'react';
import { prefix } from 'boardgamereactio-common/LimiteLimite/LimiteLimite'

interface GamePropositionPlayerProps extends DefaultProps {
    sentence: SentenceCardModel
    hand: Hand
}
interface GamePropositionPlayerState {
    selectedPropIndexes: number[]
    sent: boolean
}

@inject(injector)
@observer
@socketConnect
class GamePropositionPlayer extends React.Component <GamePropositionPlayerProps, GamePropositionPlayerState> {

    constructor(props: GamePropositionPlayerProps){
        super(props)
        this.state = {
            selectedPropIndexes: [],
            sent: false
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
        this.props.socket.emit(prefix + 'game:send_prop', serialize(propCards))
        this.setState({ sent: true })
    }

    renderHand(){
        return this.props.hand.cards.map( (propCard:PropositionCardmodel, k) => 
        <div 
            key={k}
            className="hand-proposition"
        >
                <PropositionCard 
                    className={this.state.selectedPropIndexes.includes(k) ? 'selected-proposition' : 'not-selected-proposition' }
                    propositionCard={propCard} 
                    onClick={() => !this.state.sent && this.selectProp(k)}
                />
                <div className="proposition-index">
                    {this.state.selectedPropIndexes.includes(k) && this.nbCardToChose > 1 && 
                        (this.state.selectedPropIndexes.indexOf(k) + 1)
                    }
                </div>
            </div>
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

                {!this.state.sent && 
                    <Button 
                        className={'send-button ' + (this.state.selectedPropIndexes.length !== this.nbCardToChose ? 'send-button-disabled' : '')}
                        variant='raised'
                        onClick={this.handleSendProps}
                        disabled={this.state.selectedPropIndexes.length !== this.nbCardToChose}
                    >
                        Validate
                    </Button>
                }
                
                <div className="game-infos-zone">
                    {!this.state.sent 
                      ? <React.Fragment>
                            {this.state.selectedPropIndexes.length === this.nbCardToChose
                                ? 'You can send your proposition'
                                : 'You selected ' + this.state.selectedPropIndexes.length + ' cards. You have to select ' + this.nbCardToChose + ' cards.'
                            }
                        </React.Fragment>
                      : 'Your choice has been sent. Please wait your friends ...'
                    }
                </div>
            </div>
        );
    }
}

export default GamePropositionPlayer;
