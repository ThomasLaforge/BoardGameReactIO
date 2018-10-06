import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../../mobxInjector'
import SentenceCard from '../../../components/Cards/SentenceCard';

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

    componentDidMount(){
        if(this.props.socket){
            // this.props.socket.on('login_accepted', (username) => {})
        }
    }

    render() {
        return (
            <div className="game-main-player">
                <h2 className='game-main-player-title'>Main player</h2>
                <div className="game-main-player-sentence">
                    <SentenceCard sentenceCard={this.props.sentence} />
                </div>
                <div className="game-main-player-infos">
                    {this.props.propositions && this.props.propositions.length > 0 ? 'Chose a proposition' : 'Waiting other players chose a proposition'}
                </div>
            </div>
        );
    }
}

export default GameMainPlayer;
