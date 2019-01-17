import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import SentenceCard from '../components/Cards/SentenceCard';

interface GameMainPlayerProps extends DefaultProps {
    sentence: any
    propositions: any
}
interface GameMainPlayerState {
}

@inject(injector)
@observer
@socketConnect
class GameMainPlayer extends React.Component <GameMainPlayerProps, GameMainPlayerState> {

    constructor(props: GameMainPlayerProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="game-main-player">
                <div className="game-main-player-sentence">
                    <SentenceCard sentenceCard={this.props.sentence} />
                </div>
                <div className="game-main-player-infos">
                    {this.props.propositions && this.props.propositions.length > 0 ? 'Chose your favorite proposition' : 'Waiting for players to chose a proposition'}
                </div>
            </div>
        );
    }
}

export default GameMainPlayer;
