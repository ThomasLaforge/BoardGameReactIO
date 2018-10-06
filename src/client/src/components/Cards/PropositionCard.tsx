import * as React from 'react';
import Card from './Card'
import {PropositionCard as PropositionCardModel} from 'limitelimite-common'

interface PropositionCardProps {
    propositionCard: PropositionCardModel
    onClick?: Function
}
interface PropositionCardState {
}

class PropositionCard extends React.Component <PropositionCardProps, PropositionCardState> {

    constructor(props: PropositionCardProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Card 
                componentClassName='propositon-card'
                content={this.props.propositionCard.content}
                onClick={() => this.props.onClick && this.props.onClick(this.props.propositionCard)}
            />
        );
    }
}

export default PropositionCard;
