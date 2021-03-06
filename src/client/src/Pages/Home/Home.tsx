import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import Button from '@material-ui/core/Button';
import TextFieldHandleEnter from '../../components/TextFieldHandleEnter';

import './home.scss'
import { Game } from 'boardgamereactio-common/TarotCongolais/Game';
import { SocketPlayer } from 'boardgamereactio-common';

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
            usernameInput: 'Tom-' + Date.now(),
            showAlreadyExists: false
        }
    }

    componentDidMount(){
        if(this.props.socket){
            // debug autolog
            // this.tryToLogin()

            this.props.socket.on('login:player.login_accepted', (username) => {
                console.log('connected with username', username)
                this.props.ui.username = username
                this.props.ui.router.switchRoute('lobby')             
            })

            this.props.socket.on('login:player.username_already_exists', (username) => {
                console.log('login already exists', username)
                this.setState({ showAlreadyExists: true })
            })
        }
    }

    tryToLogin = () => {
        this.props.socket && this.props.socket.emit('login:new_user', this.state.usernameInput)
    }

    render() {
        return (
            <div className="home">
                <div className="home-content">
                    <div className="home-logo" />
                    <div className="home-login">
                        <TextFieldHandleEnter
                            className='home-login-input'
                            label={this.state.showAlreadyExists ? 'Username already used, change it!' : 'Chose your username'}
                            value={this.state.usernameInput} 
                            onChange={(e)=> this.setState({usernameInput: e.target.value})}
                            eventOnEnter={this.tryToLogin}
                            error={this.state.showAlreadyExists}
                        />
                        <Button
                            className='home-login-btn' 
                            onClick={this.tryToLogin} 
                            variant='contained'
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
