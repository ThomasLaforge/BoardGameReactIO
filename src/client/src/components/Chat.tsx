import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import { Button, TextField } from '@material-ui/core';
import {ChatMessage} from 'limitelimite-common/Server'

interface ChatProps extends DefaultProps {
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
            this.props.socket.on('newMessage', (message: ChatMessage) => {
                console.log('new message', message)
                this.setState({messages: this.state.messages.concat(message)})
            })
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="chat-messages">
                    {this.state.messages.map(m => 
                        <div className="chat-messages">
                            <div className='chat-message-sender'>{m.username}</div>
                            <div className='chat-message-content'>{m.msg}</div>
                        </div>
                    )}
                </div>
                <div className="chat-input-zone">
                    <div className="input-message">
                        <TextField 
                            placeholder='Write your message...'
                            value={this.state.message}
                            onChange={(e) => this.setState({message: e.target.value})}
                        />
                    </div>
                    <div className="input-submit">
                        <Button onClick={() => { this.props.socket.emit('chat-sendMessage', this.state.message); this.setState({message: ''})}}>Send</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
