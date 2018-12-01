import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { Card as TCCard} from 'boardgamereactio-common/TarotCongolais/Card';

import Card from '../components/Card/Card'

import { Button } from '@material-ui/core';

interface SoloCardPhaseProps extends DefaultProps {
    otherPlayersCards: any[]
    onPrediction: Function
    isPlayerToBet: boolean
}
interface SoloCardPhaseState {
}

@inject(injector)
@observer
@socketConnect
class SoloCardPhase extends React.Component <SoloCardPhaseProps, SoloCardPhaseState> {

    constructor(props: SoloCardPhaseProps){
        super(props)
        this.state = {
        }
    }

    renderOtherPlayersCards(){
        return this.props.otherPlayersCards.map(cardJson => {
            let card = new TCCard(cardJson._value)
            return <Card card={card} />
        })
    }

    render() {
        return (
            <div className="game-part-solo-card">
                <div className="other-player-cards">
                    {this.renderOtherPlayersCards()}
                </div>
                {this.props.isPlayerToBet
                    ? <div className="prediction-choice">
                        <div className="prediction-choice-description">
                            Do you think you have the biggest one ?
                        </div>
                        <div className="prediction-choice-choices">
                            <Button
                                onClick={()=> this.props.isPlayerToBet && this.props.onPrediction(true)}
                                variant='raised'
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={()=> this.props.isPlayerToBet && this.props.onPrediction(false)}
                                variant='raised'
                            >
                                No
                            </Button>
                        </div>
                    </div>
                    : <div className="waiting-prediction">
                        Waiting for others players bet
                    </div>
                
                }
            </div>
        );
    }
}

export default SoloCardPhase;
