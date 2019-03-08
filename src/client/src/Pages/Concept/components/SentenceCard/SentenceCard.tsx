import * as React from 'react'
import {SentenceCard as SentenceCardModel} from 'boardgamereactio-common/Concept/SentenceCard';

import './style.scss'
import Smiley from '../Smiley/Smiley';

interface SentenceCardProps {
    card: SentenceCardModel
}
interface SentenceCardState {
}

export class SentenceCard extends React.Component<SentenceCardProps, SentenceCardState> {

    constructor(props: SentenceCardProps) {
        super(props)
        this.state = {
        }
    }

    renderSentenceGroups(){
        let groups = []
        const groupSize = 3
        const sentences = this.props.card.sentences
        const nbSentences = sentences.length

        for (let i = 0; i < nbSentences / groupSize; i++) {
            groups.push(
                <div className={'sentence-groups-elt sentence-group-' + i}>
                    <div className={'sentence-groups-icon sentence-groups-icon-'+i}>
                        <Smiley emotion={i} />
                    </div>
                    <div className='sentence-groups-content'>
                        {Array(groupSize).fill('').map( (_, j) => [
                            <div className="sentence-elt">
                                <div className={"sentence-elt-number sentence-elt-number-" + i}>
                                    {i * groupSize + j + 1}
                                </div>
                                <div className="sentence-elt-text">
                                    {sentences[i * groupSize + j]}
                                </div>
                            </div>,
                            j < 2 && <div className="sentence-separator" />
                        ]
                        )}
                    </div>
                </div>
            )            
        }

        return <div className="sentence-groups">
            {groups}
        </div>
    }

    render() {
        return (
        <div className='concept-sentence-card'>
            {this.renderSentenceGroups()}
        </div>
        )
    }
}

export default SentenceCard