import * as React from 'react';

import { Card as TarotCongolaisCard } from 'limitelimite-common/TarotCongolais/Card'

interface CardProps {
    card: TarotCongolaisCard
    onClick?: Function
    selected?: boolean
}
interface CardState {
}

class Card extends React.Component <CardProps, CardState> {

    constructor(props: CardProps){
        super(props)
        this.state = {
        }
    }

    render() {
        const card = this.props.card
        return (
            <div className={"card" + (this.props.selected ? ' card-selected': '')}>
                <div 
                    className="card-value"
                    onClick={() => this.props.onClick && this.props.onClick()}
                >
                    {card.value}
                </div>
            </div>
        );
    }
}

export default Card;
