import * as React from 'react';

import { Card as TarotCongolaisCard } from 'boardgamereactio-common/TarotCongolais/Card'

import Card from '../Card/Card'

import './hand.scss'

interface HandProps {
    cards: TarotCongolaisCard[]
    onCardSelection?: Function
    passChangeExcuseValue?: Function
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
                onClick={(cardValue) => this.props.onCardSelection && this.props.onCardSelection(k, cardValue)}
                selected={(this.props.selectedIndex || this.props.selectedIndex === 0)  && this.props.selectedIndex === k}
                changeExcuseValue={() => this.props.passChangeExcuseValue && this.props.passChangeExcuseValue(k)}
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
