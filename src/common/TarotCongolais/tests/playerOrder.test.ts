import { Game } from "../Game";
import { SocketPlayer } from "../../modules/SocketPlayer";
import { Player } from "../Player";

function getPlayersIds(players: (SocketPlayer| Player)[]){
    return players.map(p => Number.parseInt(p.socketid))
}


describe('tc-play-order', () => {
    const initPlayers = Array(4).fill('').map( (e, i) => new SocketPlayer('p' + i, i.toString()))

    test('initial order', () => {
        let tcgame = new Game(initPlayers, false)
        tcgame.start()
        // console.log('after start', tcgame.players)
        expect(getPlayersIds(tcgame.players)).toEqual([0,1,2,3])
    })

    // test('after first trick', () => {
    //     let tcgame = new Game(initPlayers, false)
    //     tcgame.start()
    //     const players = tcgame.players
    //     players.forEach(p => {
    //         tcgame.addBet({ bet: 0, player: p })
    //     })
    //     players.forEach( (p, i) => {
    //         tcgame.addPlay({ card: p.hand.cards[0], player: p })
    //     })
    //     const lastWinnerPlayerId = (tcgame.turn.arrTrick[0].getWinner() as Player).socketid
    //     const firstPlayerId = 
    //     console.log('playerId', firstPlayerId)
    //     expect(firstPlayerId).toBe(lastWinnerPlayerId)
    // })
    
})
