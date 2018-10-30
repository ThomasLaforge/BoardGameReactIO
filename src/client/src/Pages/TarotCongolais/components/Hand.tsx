import * as React from 'react';

import { Card as TarotCongolaisCard } from 'limitelimite-common/TarotCongolais/Card'

import Card from './Card'

interface HandProps {
    cards: TarotCongolaisCard[]
    onCardSelection?: Function
    selectedIndex?: number
}
interface HandState {
}

class Hand extends React.Component <HandProps, HandState> {

    constructor(props: HandProps){
        super(props)
        this.state = {
        }
    }



    renderCards(){
        return this.props.cards.map( (c, k) => 
            <Card
                key={k}
                card={c}
                onClick={() => this.props.onCardSelection && this.props.onCardSelection(k)}
                selected={this.props.selectedIndex && this.props.selectedIndex === k}
            />
        )
    }

    render() {
        return (
            <div className="hand">
                {this.renderCards()}
            </div>
        );
    }
}

export default Hand;
