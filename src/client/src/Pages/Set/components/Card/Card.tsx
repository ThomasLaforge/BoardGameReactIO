import * as React from 'react'

import { Card as SetCard } from 'boardgamereactio-common/Set/Card'

import Shape from '../Shape/Shape';

import './style.scss'

interface CardProps {
    card: SetCard
    selected: boolean
    isFromCombination: boolean
    isSolution: boolean
    onClick: Function
}
interface CardState {
}

export class Card extends React.Component<CardProps, CardState> {

    constructor(props: CardProps) {
        super(props)
        this.state = {
        }  
    }

    renderShapes(){
        const {shape, color, filling} = this.props.card
        return Array(this.props.card.number)
            .fill('')
            .map( (e, k) => 
                <Shape
                    key={k}
                    type={shape}
                    color={color}
                    filling={filling}
                />
            )
    }

    handleClickOnCard = () => {
        this.props.onClick()
    }

    render() {
        // console.log('card to render', this.props.card)
        return (
            <div
                className={'set-card' + 
                    (this.props.selected ? ' set-card-selected' : '') +
                    (this.props.isFromCombination ? ' set-card-combination' : '') +
                    (this.props.isSolution ? ' set-card-solution' : '')
                }
                onClick={this.handleClickOnCard}
            >
                {this.renderShapes()}
            </div>
        )
    }
}

export default Card