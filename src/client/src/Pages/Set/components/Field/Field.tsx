import * as React from 'react'

import { Card as SetCard } from 'boardgamereactio-common/Set/Card'

import Card from '../Card/Card'

import './style.scss'
import { Combination as SetCombination } from 'boardgamereactio-common/Set/Combination';
import { Field as SetField } from 'boardgamereactio-common/Set/Field';

interface FieldProps {
    cards: SetCard[],
    hasAlreadyPlayed: boolean
    selectedCardsIndex: number[]
    handleClick: Function
    combination?: SetCombination | null
    showSolution?: boolean
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

    getSetField(){
        return new SetField(this.props.cards)
    }

    getSolution(){
        return this.getSetField().getSolutions()[0]
    }

    renderCards(){
        // console.log('this.props', this.props.cards)
        return this.props.cards.map( (c, k) => 
            <Card key={k}
                card={c}
                selected={!this.props.hasAlreadyPlayed && this.props.selectedCardsIndex.includes(k)}
                onClick={() => this.props.handleClick(k)}
                isFromCombination={this.props.combination && this.props.combination.cards.findIndex( solutionCard => c.isEqual(solutionCard)) !== -1}
                isSolution={this.props.showSolution && this.getSetField().hasSolution() && this.getSolution().cards.findIndex( solutionCard => c.isEqual(solutionCard)) !== -1}
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