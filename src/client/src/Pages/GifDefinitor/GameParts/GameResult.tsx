import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif';
import Proposition from '../components/Proposition';

interface GameResultProps extends DefaultProps {
    gifUrl: string
    propositions: string[]
    chosenPropositionIndexes: number[]
    winnerPlayerNames: string[]
}
interface GameResultState {
}

@inject(injector)
@observer
@socketConnect
class GameResult extends React.Component <GameResultProps, GameResultState> {

    constructor(props: GameResultProps){
        super(props)
        this.state = {
        }
    }

    renderPropositions(){
        console.log('props', this.props.propositions)
        return this.props.propositions.map( (p, k) =>   
            <Proposition 
                key={k} 
                content={p}
            />
        )
    }

    render() {
        return (
            <div className="game-result">
                <div className="game-result-gif">
                    <Gif url={this.props.gifUrl} />
                </div>
                <div className="game-result-propositions">
                    {this.renderPropositions()}
                </div>
                <div className='game-zone-info'>
                </div>
            </div>
        );
    }
}

export default GameResult;
