import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';
import * as path from 'path'

// My socket
import { SuperSocket } from './SuperSocket';
import { ExtendedSocket } from './Server';
import { SocketIoDescriptor } from './SocketIoDescriptor';

// Events
import { addLoginEvents } from './socketEvents/login'
import { addLobbyEvents } from './socketEvents/lobby'
import { addLimiteLimiteEvents } from './gamesEvents/limitelimite'
import { addTarotCongolaisEvents } from './gamesEvents/tarotCongolais'
import { addGifDefinitorEvents } from './gamesEvents/gifDefinitor'
import { addFlipEvents } from './gamesEvents/flip'
import { addSetEvents } from './gamesEvents/set'
import { addChatEvents } from './socketEvents/chat'

import { GameCollection } from '../common/modules/GameCollection';

import { serverPort } from '../common/modules/Server';

const games: any = [
    {
        name: 'limitelimite',
        addEvents: addLimiteLimiteEvents
    },
    {
        name: 'tarotcongolais',
        addEvents: addTarotCongolaisEvents
    },
    {
        name: 'gifdefinitor',
        addEvents: addGifDefinitorEvents
    },
    {
        name: 'set',
        addEvents: addSetEvents
    },
    {
        name: 'flip',
        addEvents: addFlipEvents
    }
]

export class BoardGameServer {

    public games: any[]

    constructor(games: any){
        this.games = games
    }

    start(){
        const app = express()
        const http = new nodeHttp.Server(app);
        const io = socketIo(http);
        let GC = new GameCollection()
    
        let hasLoggedAllSocketEvents = false
    
        // render index page
        // console.log('dirName =', __dirname, path.join(__dirname, '../../src/client'))
        const clientDirPath = path.join(__dirname, '../../src/client')
    
        // public directory
        app.use(express.static(clientDirPath));
    
        // render app
        app.get('/', function (req, res) {
            res.sendFile(path.join(clientDirPath, 'index.html'));
        });
    
        // INFO: naming of "on" events and emit: Category:portée.main_mission/sub_mision_or_state
        // ex: on Lobby:create_game/succes
        // ex: emit Lobby:player.create_game/succes
    
        io.on('connection', (baseSocket: ExtendedSocket) => {
            const server = new SocketIoDescriptor(baseSocket.server)
            let socket = new SuperSocket(baseSocket)
            console.log('a user connected', socket.id);
    
            // add events from modules
            addLoginEvents(socket)
            addChatEvents(socket)
            addLobbyEvents(socket, GC)
    
            // add games events
            games.forEach( (g: any) => {
                g.addEvents(socket, GC)
            })
    
            socket.on('reconnecting', () => {
                console.log('reconnecting...')
            })
    
            socket.on('reconnect', () => {
                console.log('reconnect...')
            })
    
            socket.on('disconnect', () => {
                console.log('disconnecting ...', socket.id)
                let game = GC.getGameWithUser(socket.id)
                if (game) {
                    let gameHasStarted = game.startGameDate
                    if (gameHasStarted) {
                        console.log('was in game', game.id)
                        // delete the game
                        // GC.removeGame(game.id)
                    }
                    else {
                        // remove player
                        game.removePlayer(socket.id)
                    }
                    socket.baseSocket.to(game.id).emit('game:user_disconnect', socket.username, gameHasStarted)
                }
            })
    
            // Debugs
            socket.on('debug:get_all_sockets', () => {
                console.log('ask getAllSockets', server.allUsernames)
                io.clients((err: any, clients: any[]) => {
                    socket.emit('debug:get_all_sockets', clients)
                })
            })
    
            // logging events
            if (!hasLoggedAllSocketEvents) {
                console.log('allEvents', baseSocket.eventNames())
                hasLoggedAllSocketEvents = true
            }
        });
    
        // start server
        http.listen(serverPort, function () {
            console.log('listening on localhost:' + serverPort);
        });
    }

}

new BoardGameServer(games).start()