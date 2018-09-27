import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import { Button } from '@material-ui/core';

interface DebugBoxProps extends DefaultProps {
}
interface DebugBoxState {
}

@inject(injector)
@observer
@socketConnect
class DebugBox extends React.Component <DebugBoxProps, DebugBoxState> {

    constructor(props: DebugBoxProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.on('getAllSockets', (data) => {
                console.log('getAllSockets', data)
            })
        }
    }

    render() {
        return (
            <div className="debug-box">
                <Button onClick={() => this.props.socket.emit('debug-getAllSockets')}>Get all sockets</Button>
            </div>
        );
    }
}

export default DebugBox;
