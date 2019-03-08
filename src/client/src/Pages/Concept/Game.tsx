import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'
import {SentenceCard as SentenceCardModel} from 'boardgamereactio-common/Concept/SentenceCard';

import SentenceCard from './components/SentenceCard/SentenceCard'
import './concept.scss'

interface GameProps extends DefaultProps {
}
interface GameState {
    card: SentenceCardModel
}

@inject(injector)
@observer
@socketConnect
class Game extends React.Component <GameProps, GameState> {

    constructor(props: GameProps){
        super(props)
        this.state = {
            card: new SentenceCardModel([
                "Gymnase",
                "Cuisine",
                "Lac",
                "Hirondelle",
                "Cirque",
                "La guerre des boutons",
                "La 5ème roue du carrosse",
                "De la Terre à la lune",
                "Famine"
            ])
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
        }
    }

    render() {
        return (
            <div className='game'>
                <SentenceCard card={this.state.card} />
            </div>
        );
    }
}

export default Game;
