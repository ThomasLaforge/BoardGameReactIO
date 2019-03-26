import * as React from 'react'

import { Card as SetCard } from 'boardgamereactio-common/Set/Card'

import Card from '../Card/Card'

import './style.scss'
import { Combination as SetCombination } from 'boardgamereactio-common/Set/Combination';

interface FieldProps {
    cards: SetCard[],
    hasAlreadyPlayed: boolean
    selectedCardsIndex: number[]
    handleClick: Function
    combination: SetCombination | null
}
interface FieldState {
}

export class Field extends React.Component<FieldProps, FieldState> {

    constructor(props: FieldProps) {
        super(props)
        this.state = {
            selectedCardsIndex: []
        }  
    }

    

    renderCards(){
        return this.props.cards.map( (c, k) => 
            <Card key={k}
                card={c}
                selected={!this.props.hasAlreadyPlayed && this.props.selectedCardsIndex.includes(k)}
                onClick={() => this.props.handleClick(k)}
                isFromCombination={this.props.combination.cards.findIndex( solutionCard => c.isEqual(solutionCard)) !== -1}
            />
        )
    }

    render() {
        return (
            <div className={'set-field' + 
                (this.props.combination ? ' set-field-with-combination' : '') +
                (this.props.hasAlreadyPlayed ? ' set-field-disabled' : '')
            }>
                {this.renderCards()}
            </div>
        )
    }
}

export default Field