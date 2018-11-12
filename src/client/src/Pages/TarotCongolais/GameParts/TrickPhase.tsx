import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { Hand as TCHand } from 'limitelimite-common/TarotCongolais/Hand';
import { Card as TCCard } from 'limitelimite-common/TarotCongolais/Card';

import { Button } from '@material-ui/core';
import Trick from '../components/Trick/Trick'
import Hand from '../components/Hand/Hand';

interface TrickPhaseProps extends DefaultProps {
    otherPlayersTricks: any[]
    hand: TCHand
    onPlay: Function
    onChangeExcuseValue: Function
    isPlayerToPlay: boolean
}
interface TrickPhaseState {
    selectedCardIndex?: number
}

@inject(injector)
@observer
@socketConnect
class TrickPhase extends React.Component <TrickPhaseProps, TrickPhaseState> {

    constructor(props: TrickPhaseProps){
        super(props)
        this.state = {
        }
    }

    renderTricks(){
        return this.props.otherPlayersTricks.map(t => 
            <Trick card={new TCCard(t.card._value)} playerName={t.playerName} />
        )
    }

    handleCardSelect = (cardIndex: number) => {
        this.setState({ selectedCardIndex: this.state.selectedCardIndex && this.state.selectedCardIndex === cardIndex ? undefined : cardIndex})
    }

    onPlay = () => {
        this.props.onPlay(this.state.selectedCardIndex)
        this.setState({
            selectedCardIndex: undefined
        })
    }

    render() {
        return (
            <div className="game-part-trick">
                <div className="played-cards">
                    {this.renderTricks()}
                </div>
                <div className="play-zone">
                    <div className="play-zone-hand">
                        <Hand 
                            cards={this.props.hand.cards} 
                            onCardSelection={this.handleCardSelect}
                            selectedIndex={this.state.selectedCardIndex}
                            passChangeExcuseValue={(cardIndex) => this.props.onChangeExcuseValue && this.props.onChangeExcuseValue(cardIndex)}
                        />
                    </div>
                    <div className="play-zone-action">
                        <Button
                            disabled={typeof this.state.selectedCardIndex === "undefined" || !this.props.isPlayerToPlay}
                            onClick={this.onPlay}
                            variant='raised'
                        >
                            Play
                        </Button>
                    </div>
                </div>
                <div className="game-part-infos">
                    { this.props.isPlayerToPlay
                        ? 'Select a card on play it'
                        : 'wait for current player to play. You can select a card.'
                    }
                </div>
            </div>
        );
    }
}

export default TrickPhase;
