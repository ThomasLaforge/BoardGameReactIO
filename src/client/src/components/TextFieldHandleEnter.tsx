import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import { Button, TextField } from '@material-ui/core';
import { TextFieldProps } from '../../node_modules/@material-ui/core/TextField';

interface MyProps extends TextFieldProps{
    eventOnEnter: Function
}

@inject(injector)
@observer
@socketConnect
class TextFieldHandleEnter extends React.Component<MyProps> {

    constructor(props: any){
        super(props)
        this.state = {
        }
    }

    render() {
        return <TextField {...this.props}
            onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                    // Do code here
                    this.props.eventOnEnter()
                    ev.preventDefault();
                }
            }}
        />;
    }
}

export default TextFieldHandleEnter;
