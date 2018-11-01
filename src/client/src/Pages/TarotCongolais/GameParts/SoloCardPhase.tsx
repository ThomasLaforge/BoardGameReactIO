import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { Card as TCCard} from 'limitelimite-common/TarotCongolais/Card';

import { Button } from '@material-ui/core';

interface SoloCardPhaseProps extends DefaultProps {
    otherPlayersCards: TCCard[]
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

    render() {
        return (
            <div className="game-part-solo-card">
                <div className="other-player-cards">
                
                </div>
                <div className="prediction-choice">
                    <div className="prediction-choice-description">
                        Do you think you have the biggest one ?
                    </div>
                    <div className="prediction-choice-choices">
                        <Button
                            onClick={()=> this.props.onPrediction(true)}
                            variant='raised'
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={()=> this.props.onPrediction(false)}
                            variant='raised'
                        >
                            No
                        </Button>
            	    </div>
                </div>
            </div>
        );
    }
}

export default SoloCardPhase;
