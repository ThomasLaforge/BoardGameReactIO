import * as React from 'react';
import Card from './Card'
import {SentenceCard as SentenceCardModel} from 'boardgamereactio-common'

interface SentenceCardProps {
    sentenceCard: SentenceCardModel
    className?: string
}
interface SentenceCardState {
}

class SentenceCard extends React.Component <SentenceCardProps, SentenceCardState> {

    constructor(props: SentenceCardProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Card 
                componentClassName={(this.props.className || '') + 'sentence-card'}
                content={this.props.sentenceCard.content}
            />
        );
    }
}

export default SentenceCard;