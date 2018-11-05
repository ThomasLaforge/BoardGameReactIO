import * as React from 'react';

import { Card as TarotCongolaisCard } from 'limitelimite-common/TarotCongolais/Card'

import './card.scss'

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

    handleChangeExcuse = (e) => {
        e.stopPropagation()
        this.props.card.switchExcuseValue()
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
                <div className='card-excuse-btn'
                    onClick={this.handleChangeExcuse}
                >
                    change value
                </div>
            </div>
        );
    }
}

export default Card;
