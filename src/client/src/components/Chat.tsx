import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import { Button } from '@material-ui/core';
import {ChatMessage} from 'limitelimite-common/Server'
import TextFieldHandleEnter from './TextFieldHandleEnter';

interface ChatProps extends DefaultProps {
    channel?: string
    title?: string
}
interface ChatState {
    message: string,
    messages: ChatMessage[]
}

@inject(injector)
@observer
@socketConnect
class Chat extends React.Component <ChatProps, ChatState> {

    constructor(props: ChatProps){
        super(props)
        this.state = {
            message: '',
            messages: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.on('chat:new_message', (message: ChatMessage) => {
                // console.log('new message', message)
                this.setState({messages: this.state.messages.concat(message)})
            })
        }
    }

    componentDidUpdate(){
        var chatContent = document.getElementById("chat-content");
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    sendMessage = () => {
        if(this.state.message.trim() !== ''){
            this.props.socket.emit('chat:send_message', this.state.message, this.props.channel); 
            this.setState({message: ''})
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="chat-title">
                    {this.props.title || 'Chat'}
                </div>
                <div className="chat-messages" id='chat-content'>
                    {this.state.messages.map( (m, k) => 
                        <div className="chat-message" key={k}>
                            <div className='chat-message-sender'>{m.username}</div>
                            <div className='chat-message-content'>{m.msg}</div>
                        </div>
                    )}
                </div>
                <div className="chat-input-zone">
                    <div className="input-message">
                        <TextFieldHandleEnter
                            fullWidth
                            placeholder='Write your message...'
                            value={this.state.message}
                            onChange={(e) => this.setState({message: e.target.value})}
                            eventOnEnter={this.sendMessage}
                        />
                    </div>
                    <div className="input-submit">
                        <Button 
                            className='chat-send-button' 
                            onClick={this.sendMessage}
                            variant='contained'
                            disabled={this.state.message.trim() === ''}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
