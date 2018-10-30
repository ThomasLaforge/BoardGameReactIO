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
        return (
            <div className="game-part-bet">
                <div className="bet-content">
                    <Button
                        onClick={() => this.handleChangeBetValue(OperationOnBetValue.Decrease)}
                        disabled={!this.canDecrease}
                    >
                        Decrease
                    </Button>

                    <div className="bet-value">{this.state.betValue}</div>

                    <Button
                        onClick={() => this.handleChangeBetValue(OperationOnBetValue.Increase)}
                        disabled={!this.canIncrease}
                    >
                        Increase
                    </Button>
                </div>

                <div className="validate-bet">
                    <Button 
                        onClick={() => this.props.onValidateBet(this.state.betValue)}
                    >
                        Validate
                    </Button>
                </div>
                
                <div className="bet-hand">
                    <Hand 
                        cards={this.props.hand.cards}
                    />
                </div>
            </div>
        );
    }
}

export default BetPhase;
