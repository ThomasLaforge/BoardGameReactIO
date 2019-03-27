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
            gameList: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.emit('lobby:get_global_lobby_list')
            
            this.props.socket.on('lobby:player.new_game', () => {
                this.props.socket.emit('lobby:get_global_lobby_list')
            })
            
            this.props.socket.on('lobby:player.update_list', (gameList: GameLobbyList) => {
                this.setState({ gameList })
            })
        }
    }

    goToGameRoom = (gameId: string) => {
        console.log('try to enter on game room with id', gameId)
        this.props.socket.emit('lobby:join', gameId)
    }
    
    renderGamesTable(){
        console.log('game list', this.state.gameList)
        return this.state.gameList.map( (g, i) => {
            let creationDate = new Date(g.creationDate)
            console.log('creation date', creationDate)
            return (
                <div className="lobby-game-list-elt" key={i}>
                    <div className="game-type">{g.gameType}</div>
                    <div className="game-creation-date">{creationDate.getDate()}/{creationDate.getMonth()}/{creationDate.getFullYear()}</div>
                    <div className="game-population"
                        title={g.people.reduce( (nameList, p) => nameList + p + "\n", '')}
                    >
                        {g.people.length} / {(g.nbPlayer || '\u221e')}
                    </div>
                    <Button 
                        className='game-join-btn'
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
                {/* <div className="lobby-game-list-filters">filters:</div> */}
                <div className="lobby-game-list-grid">
                    {this.renderGamesTable()}                    
                </div>
            </div>
        );
    }
}

export default GameList;