import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';
import * as path from 'path'

// My socket
import { SuperSocket } from './SuperSocket';
import { ExtendedSocket } from './LimiteLimiteServer';
import { SocketIoDescriptor } from './SocketIoDescriptor';

// Events
import { addLoginEvents } from './socketEvents/login'
import { addLobbyEvents } from './socketEvents/lobby'
import { addLimiteLimiteEvents } from './socketEvents/limitelimite'
import { addTarotCongolaisEvents } from './socketEvents/tarotCongolais'
import { addGifDefinitorEvents } from './socketEvents/gifDefinitor'
import { addChatEvents } from './socketEvents/chat'

import { GameCollection } from '../common/modules/GameCollection';

import { serverPort } from '../common/Server';

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
    addLimiteLimiteEvents(socket, GC)
    addTarotCongolaisEvents(socket, GC)
    addGifDefinitorEvents(socket, GC)

    socket.on('reconnecting', () => {
        console.log('reconnecting...')
    })

    socket.on('reconnect', () => {
        console.log('reconnect...')
    })

    socket.on('disconnect', () => {
        let game = GC.getGameWithUser(socket.id)
        if (game) {
            let gameHasStarted = game.startGameDate
            if (gameHasStarted) {
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