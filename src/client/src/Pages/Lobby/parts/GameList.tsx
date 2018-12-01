import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import { DefaultProps, injector } from '../../../mobxInjector'
import { GameLobbyList } from 'boardgamereactio-common';
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
            gameList: new Array(10).fill({
                gameId: 'test-gameid',
                nbPlayer: 4,
                nbPlayersOnGame: 3,
                creationDate: Date.now()
            })
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
        return this.state.gameList.map( (g, i) => {
            let creationDate = new Date(g.creationDate)
            return (
                <div className="lobby-game-list-elt" key={i}>
                    <div className="game-cretion-date">{creationDate.getDate()} / {creationDate.getMonth()} / {creationDate.getFullYear()}</div>
                    <div className="game-population">{g.nbPlayersOnGame} / {g.nbPlayer}</div>
                    <Button 
                        variant='raised'
                        onClick={() => this.goToGameRoom(g.gameId)}
                    >
                        Join
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