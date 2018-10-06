import * as React from 'react';
import Card from './Card'
import {SentenceCard as SentenceCardModel} from 'limitelimite-common'

interface SentenceCardProps {
    sentenceCard: SentenceCardModel
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
                componentClassName='sentence-card'
                content={this.props.sentenceCard.content}
            />
        );
    }
}

export default SentenceCard;