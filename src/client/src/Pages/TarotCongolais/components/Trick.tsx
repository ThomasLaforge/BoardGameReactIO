import * as React from 'react';

import { Trick as TarotCongolaisTrick } from 'limitelimite-common/TarotCongolais/Trick'
import { Card as TCCard } from 'limitelimite-common/TarotCongolais/Card'
import Card from './Card';

interface TrickProps {
    card: TCCard
    playerName: string    
}
interface TrickState {

}

class Trick extends React.Component <TrickProps, TrickState> {

    constructor(props: TrickProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="trick">
                <div className="trick-value">
                    <Card card={this.props.card} />
                </div>
                <div className="trick-player">
                    {this.props.playerName}
                </div>
            </div>
        );
    }
}

export default Trick;
