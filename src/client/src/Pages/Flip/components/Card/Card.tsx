import React, { Component } from 'react'
import { CardColor } from 'boardgamereactio-common/Flip/defs';

import './style.scss'

interface CardProps {
    value: number
    color: CardColor
    onClick: Function
    selected: boolean
}
interface CardState {
}

export class Card extends Component<CardProps, CardState> {

    constructor(props: CardProps) {
        super(props)
        this.state = {
        }  
    }

  render() {
    const {value, color} = this.props

    return (
        <div className={`flip-card card-${value}_${color}` + this.props.selected ? ' flip-card-selected' : ''} 
            onClick={() => this.props.onClick && this.props.onClick()}
        />
    )
  }
}

export default Card