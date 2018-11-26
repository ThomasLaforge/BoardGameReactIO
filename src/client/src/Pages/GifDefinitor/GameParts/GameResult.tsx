import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'

import Gif from '../components/Gif/Gif';
import Proposition from '../components/Proposition/Proposition';
import { NB_SECONDS_BEFORE_NEXT_TURN } from 'limitelimite-common/GifDefinitor/GifDefinitor';
import Timer from 'src/components/Timer';

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
        console.log('props', this.props.propositions, this.props.winnerPlayerNames, this.props.chosenPropositionIndexes)
        return this.props.propositions.map( (p: any, k) =>   
            <Proposition 
                key={k} 
                content={p.sentence}
            />
        )
    }

    render() {
        let winnersNamesString = ''
        this.props.winnerPlayerNames.forEach( (name, i) => {
            winnersNamesString += name
            if(i === this.props.winnerPlayerNames.length - 2){
                winnersNamesString += ' and '            
            }
            else if(i < this.props.winnerPlayerNames.length - 2){
                winnersNamesString += ', '            
            }
        })

        return (
            <div className="game-result">
                <div className="game-result-gif">
                    <Gif url={this.props.gifUrl} />
                </div>
                <div className="game-result-propositions">
                    {this.renderPropositions()}
                </div>
                <div className='game-infos-zone'>
                    <div className="info-result-winners">
                        {winnersNamesString} won this turn.
                    </div>
                    <Timer duration={NB_SECONDS_BEFORE_NEXT_TURN}/>
                </div>
            </div>
        );
    }
}

export default GameResult;
