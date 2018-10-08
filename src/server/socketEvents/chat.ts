import { SuperSocket } from '../SuperSocket';
import { 
    GameCollection, 
    ChatMessage
} from '../../common';

export const addChatEvents = (socket: SuperSocket) => {    // Chats
    socket.on('chat:send_message', (message: string, channel?: string) => {
        console.log('channel', channel);
        channel = channel || 'lobby'
        
        let chatMsg: ChatMessage = {username: socket.username || 'unknown', msg: message.trim()}
        socket.baseSocket.to(channel).emit('chat:new_message', chatMsg)
        socket.emit('chat:new_message', chatMsg)
    })
}