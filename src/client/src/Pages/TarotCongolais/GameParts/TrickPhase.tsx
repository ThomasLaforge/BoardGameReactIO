import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { Hand as TCHand} from 'limitelimite-common/TarotCongolais/Hand';

import { Button } from '@material-ui/core';
import Trick from '../components/Trick'
import Hand from '../components/Hand';

interface TrickPhaseProps extends DefaultProps {
    otherPlayersTricks: any[]
    hand: TCHand
    onPlay: Function
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
            <Trick card={t.card} playerName={t.playerName} />
        )
    }

    handleCardSelect = (cardIndex: number) => {
        this.setState({ selectedCardIndex: this.state.selectedCardIndex && this.state.selectedCardIndex === cardIndex ? undefined : cardIndex})
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
                        />
                    </div>
                    <div className="play-zone-action">
                        <Button
                            disabled={typeof this.state.selectedCardIndex === "undefined"}
                            onClick={() => this.props.onPlay(this.state.selectedCardIndex)}
                        >
                            Play
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrickPhase;
