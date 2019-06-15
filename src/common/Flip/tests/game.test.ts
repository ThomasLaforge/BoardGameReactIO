import { Game } from "../Game";
import { Player } from "../Player";
import { SocketPlayer } from "../../modules/SocketPlayer";

describe('flip game', () => {
    
    let players = [
        new SocketPlayer('thomas', 'tom_socket'),
        new SocketPlayer('melane', 'mel_socket')
    ]
    let game = new Game(players)
    
    test('init game', () => {
        game.start()
        game.players.forEach(p => {
            console.log('decks', p.username, p.deck)
        })
        console.log('stacks on create', game.stacks)
        expect(game.players.length).toEqual(2);
    })
})
