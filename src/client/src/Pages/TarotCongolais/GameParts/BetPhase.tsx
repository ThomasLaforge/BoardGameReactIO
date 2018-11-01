import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import { Hand as TCHand} from 'limitelimite-common/TarotCongolais/Hand';
import { prefix } from 'limitelimite-common/TarotCongolais/TarotCongolais'

import Hand from '../components/Hand/Hand'
import { Button } from '@material-ui/core';

enum OperationOnBetValue {
    Increase,
    Decrease
}

interface BetPhaseProps extends DefaultProps {
    hand: TCHand
    onValidateBet: Function
    isPlayerToBet: boolean
    impossibleBetForLastPlayer: number | undefined
}
interface BetPhaseState {
    betValue: number
}

@inject(injector)
@observer
@socketConnect
class BetPhase extends React.Component <BetPhaseProps, BetPhaseState> {

    constructor(props: BetPhaseProps){
        super(props)
        this.state = {
            betValue: 0
        }
    }

    get canDecrease(){
        return this.state.betValue > 0
    }
    get canIncrease(){
        return this.state.betValue < this.props.hand.cards.length
    }

    handleChangeBetValue = (op: OperationOnBetValue) => {
        if(op === OperationOnBetValue.Decrease){
            this.canDecrease && this.setState({ betValue: this.state.betValue - 1 })
        }
        else if(op === OperationOnBetValue.Increase){
            this.canIncrease && this.setState({ betValue: this.state.betValue + 1})
        }
    }

    render() {
        console.log('isPlayerToBet', this.props.isPlayerToBet)
        return (
            <div className="game-part-bet">
                <div className="bet-content">
                    <div className="bet-value-selector">
                        <Button
                            className='bet-btn-change-value bet-btn-decrease'
                            onClick={() => this.handleChangeBetValue(OperationOnBetValue.Decrease)}
                            disabled={!this.canDecrease}
                            variant='raised'
                        >
                            -
                        </Button>

                        <div className="bet-value">{this.state.betValue}</div>

                        <Button
                            className='bet-btn-change-value bet-btn-increase'
                            onClick={() => this.handleChangeBetValue(OperationOnBetValue.Increase)}
                            disabled={!this.canIncrease}
                            variant='raised'
                        >
                            +
                        </Button>
                    </div>

                    <div className="validate-bet">
                        <Button
                            disabled={!this.props.isPlayerToBet && this.state.betValue !== this.props.impossibleBetForLastPlayer}
                            onClick={() => this.props.onValidateBet(this.state.betValue)}
                            variant='raised'
                        >
                            Validate
                        </Button>
                    </div>
                </div>

                
                <div className="bet-hand">
                    <Hand 
                        cards={this.props.hand.cards}
                    />
                </div>

                <div className="game-info">
                    { this.props.isPlayerToBet 
                        ? 'Vous devez annoncer le nombre de plis que vous comptez réaliser avec votre main'
                        : 'Vous devez attendre que les autre joueurs parient'
                    }
                </div>
            </div>
        );
    }
}

export default BetPhase;
