import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'

interface HomeProps extends DefaultProps {
}
interface HomeState {
}

@inject(injector)
@observer
@socketConnect
class Home extends React.Component <HomeProps, HomeState> {

    constructor(props: HomeProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){
            // this.props.socket.on('login_accepted', (username) => {})
        }
    }

    render() {
        return (
            <div className="">
            </div>
        );
    }
}

export default Home;
