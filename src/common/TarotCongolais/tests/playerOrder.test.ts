import { Game } from "../Game";
import { SocketPlayer } from "../../modules/SocketPlayer";
import { Player } from "../Player";
import { Deck } from "../Deck";

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
    
    test('after first trick', () => {
        const fakeDeck = new Deck(undefined, false)
        console.log('fakeDeck', fakeDeck)
        let tcgame = new Game(initPlayers, false, fakeDeck)
        console.log(tcgame.deck.arrayDeck)
        tcgame.start()
        const players = tcgame.players
        players.forEach(p => {
            tcgame.addBet({ bet: 0, player: p })
        })
        players.forEach( (player, i) => {
            console.log('cards', player.socketid, player.hand.cards.map(c => c.value))
            let card = player.hand.cards[0]
            if(card.isExcuse()){
                card.choseExcuseValue(0)
            }
            tcgame.addPlay({ card: card, player })
        })
        const lastWinnerPlayerId = (tcgame.turn.arrTrick[0].getWinner() as Player).socketid
        const firstPlayerId = tcgame.playersFPOV[tcgame.players.length - 1].socketid
        console.log('playerId', firstPlayerId)
        expect(firstPlayerId).toBe(lastWinnerPlayerId)
    })
    
    // test('after first trick', () => {
    //     let tcgame = new Game(initPlayers)
    //     tcgame.start()
    //     const lastWinnerPlayerId = (tcgame.turn.arrTrick[0].getWinner() as Player).socketid
    //     const firstPlayerId = tcgame.playersFPOV[tcgame.players.length - 1].socketid
    //     expect(firstPlayerId).toBe(lastWinnerPlayerId)
    // })
    
})
