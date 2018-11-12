import * as React from 'react';

import {EXCUSE_VALUE_HIGH, EXCUSE_VALUE_LOW} from 'limitelimite-common/TarotCongolais/TarotCongolais'
import { Card as TarotCongolaisCard } from 'limitelimite-common/TarotCongolais/Card'

import './card.scss'

interface CardProps {
    card: TarotCongolaisCard
    onClick?: Function
    selected?: boolean
    changeExcuseValue?: Function
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
        console.log('card', this.props.card, this.props.card.isExcuse(), !!this.props.changeExcuseValue)
        this.props.card.isExcuse() && !!this.props.changeExcuseValue && this.props.changeExcuseValue()
        // const c = new TarotCongolaisCard(this.state.cardValue)
        // c.switchExcuseValue()
        // this.setState({
        //     cardValue: c.value
        // })
    }

    render() {
        const card = this.props.card
        console.log('card value', this.props.card.value)
        return (
            <div className={"card" + (this.props.selected ? ' card-selected': '')}>
                <div 
                    className="card-value"
                    onClick={() => this.props.onClick && this.props.onClick(this.props.card.value)}
                >
                    {this.props.card.value}
                </div>
                {!!this.props.changeExcuseValue && this.props.card.isExcuse() &&
                    <div className='card-excuse-btn'
                        onClick={this.handleChangeExcuse}
                    >
                        -> {this.props.card.value === EXCUSE_VALUE_HIGH ? EXCUSE_VALUE_LOW : EXCUSE_VALUE_HIGH}
                    </div>
                }
            </div>
        );
    }
}

export default Card;
