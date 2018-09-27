import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { RouteEnum } from '../Router/Route';

interface HomeProps extends DefaultProps {
}
interface HomeState {
    usernameInput: string
}

@inject(injector)
@observer
@socketConnect
class Home extends React.Component <HomeProps, HomeState> {

    constructor(props: HomeProps){
        super(props)
        this.state = {
            usernameInput: ''
        }
    }

    componentDidMount(){
        if(this.props.socket){
            console.log('socket')
            this.props.socket.on('login_accepted', (username, testValue) => {
                console.log('connected with username', username, testValue)
                this.props.ui.router.switchRoute(RouteEnum.GameLobby)             // })
            })
        }
    }

    tryToLogin = () => {
        this.props.socket && this.props.socket.emit('login', this.state.usernameInput)
    }

    render() {
        return (
            <div className="home">
                {/* Home - {this.props.socket && this.props.socket.id} {this.state.socket_string} */}
                <TextField 
                    label='username'
                    value={this.state.usernameInput} 
                    onChange={(e)=> this.setState({usernameInput: e.target.value})} 
                />
                <Button onClick={this.tryToLogin}>Login</Button>
            </div>
        );
    }
}

export default Home;
