import React, { Component } from 'react'
import { Card as CardModel } from 'boardgamereactio-common/Flip/Card';
import Card from '../Card/Card';

interface PlayerProps {
    cards: CardModel[]
    isPlayer: boolean
    selectedCardIndex?: number
    onSelectCard?: Function
}
interface PlayerState {
}

export class Player extends Component<PlayerProps, PlayerState> {

    constructor(props: PlayerProps) {
        super(props)
        this.state = {
        }  
    }

    renderCards(){
        console.log('cards to render', this.props.cards)
        return this.props.cards.map( (c, i) => 
            <Card 
                value={c.value} 
                color={c.color}
                selected={this.props.selectedCardIndex === i}
                onClick={() => this.props.onSelectCard && this.props.onSelectCard(i)}
            />
        )
    }

    render() {
        return (
            <div className={'player ' + (this.props.isPlayer ? 'main-player' : 'opponent-player')}>
                <div className="cards">
                    {this.renderCards()}
                </div>
            </div>
        )
    }
}

export default Player