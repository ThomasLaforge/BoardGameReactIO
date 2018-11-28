import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import { DefaultProps, injector } from '../../../mobxInjector'
import { GameLobbyList } from 'limitelimite-common';
import { Button } from '@material-ui/core';

interface GameListProps extends DefaultProps {
}
interface GameListState {
    gameList: any
}

@socketConnect
class GameList extends React.Component <GameListProps, GameListState> {

    constructor(props: GameListProps){
        super(props)
        this.state = {
            gameList: [{
                gameId: 'test-gameid',
                nbPlayer: 4,
                nbPlayersOnGame: 3
            }]
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.emit('lobby:get_global_lobby_list')
        }

        // this.props.socket.on('lobby:player.update_list', (gameList: GameLobbyList) => {
        //     this.setState({ gameList })
        // })
    }

    goToGameRoom = (gameId: string) => {
        console.log('try to enter on game room with id', gameId)
    }
    
    renderGamesTable(){
        console.log('game list', this.state.gameList)
        return this.state.gameList.map( g => {
            return (
                <div className="lobby-game-list-elt" key={g.gameId}>

                    <Button 
                        variant='raised'
                        onClick={() => this.goToGameRoom(g.gameId)}
                    >
                        Go !
                    </Button>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="lobby-game-list">
                <div className="lobby-game-list-title">Liste des parties à rejoindre</div>
                <div className="lobby-game-list-filters">filters:</div>
                <div className="lobby-game-list-grid">
                    {this.renderGamesTable()}                    
                </div>
            </div>
        );
    }
}

export default GameList;