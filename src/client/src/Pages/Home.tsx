import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { RouteEnum } from '../Router/Route';
import TextFieldHandleEnter from '../components/TextFieldHandleEnter';

interface HomeProps extends DefaultProps {
}
interface HomeState {
    usernameInput: string,
    showAlreadyExists: boolean
}

@inject(injector)
@observer
@socketConnect
class Home extends React.Component <HomeProps, HomeState> {

    constructor(props: HomeProps){
        super(props)
        this.state = {
            usernameInput: '',
            showAlreadyExists: false
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.on('login_accepted', (username) => {
                console.log('connected with username', username)
                this.props.ui.router.switchRoute(RouteEnum.GameLobby)             // })
            })

            this.props.socket.on('login_usernameAlreadyExists', (username) => {
                console.log('login already exists', username)
                this.setState({ showAlreadyExists: true })
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
                <TextFieldHandleEnter 
                    label={this.state.showAlreadyExists ? 'username already used' : 'username'}
                    value={this.state.usernameInput} 
                    onChange={(e)=> this.setState({usernameInput: e.target.value})}
                    eventOnEnter={this.tryToLogin}
                    error={this.state.showAlreadyExists}
                />
                <Button onClick={this.tryToLogin}>Login</Button>
            </div>
        );
    }
}

export default Home;
