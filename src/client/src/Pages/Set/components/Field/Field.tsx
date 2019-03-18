import * as React from 'react'

import { Card as SetCard } from 'boardgamereactio-common/Set/Card'

import Card from '../Card/Card'

import './style.scss'

interface FieldProps {
    cards: SetCard[]
}
interface FieldState {
}

export class Field extends React.Component<FieldProps, FieldState> {

    constructor(props: FieldProps) {
        super(props)
        this.state = {
        }  
    }

    renderCards(){
        return this.props.cards.map( (c, k) => 
            <Card key={k}
                card={c}
            />
        )
    }

    render() {
        return (
            <div className='set-field'>
                {this.renderCards()}
            </div>
        )
    }
}

export default Field