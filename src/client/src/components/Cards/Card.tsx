import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';

interface CardProps {
    content: string
    componentClassName: string
    onClick?: Function
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
        return (
            <div 
                className={'card ' + this.props.componentClassName}
                onClick={() => this.props.onClick && this.props.onClick()}
            >
                {this.props.content}
            </div>
        );
    }
}

export default Card;
