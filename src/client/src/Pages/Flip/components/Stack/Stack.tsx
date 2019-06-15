import React, { Component } from 'react'

import { Card as CardModel } from 'boardgamereactio-common/Flip/Card';
import Card from '../Card/Card';

interface StackProps {
    card: CardModel | null
    onClick: Function
}
interface StackState {
}

export class Stack extends Component<StackProps, StackState> {

    constructor(props: StackProps) {
        super(props)
        this.state = {
        }  
    }

  render() {
    return (
      <div className='stack' onClick={() => this.props.onClick()}>
        {this.props.card 
          ? <Card 
              value={this.props.card.value} 
              color={this.props.card.color}
            />
          : '-'
        }
      </div>
    )
  }
}

export default Stack