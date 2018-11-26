import { socketConnect, SocketProvider } from 'socket.io-react';

import * as React from 'react';
import * as io from 'socket.io-client';
import RouterComponent from './Router/RouterComponent';
import { Provider, observer } from 'mobx-react';
import { Store } from './Stores/Store';
import { DefaultProps } from './mobxInjector';

import './App.scss';

const uri = location.protocol + '//' + location.hostname + ':3027';
// console.log('path of api', location, uri)

// const options = { transports: ['websocket'] };
// const socket = io.connect(uri, options)
const socket = io.connect(uri)

let games: any[] = []

interface AppProps extends DefaultProps {}

@observer
export default class App extends React.Component<AppProps, { store: Store, drawerOpened: boolean} > {

	constructor(props: any){
		super(props);
		this.state = {
			store: new Store(games),
			drawerOpened: false
		}
	}

	toggleDrawer = () => {
		this.setState({ drawerOpened: ! this.state.drawerOpened })
	}

	render() {
		return (
			<SocketProvider socket={socket}> 
			<Provider store={this.state.store} >
				<AppContent />
			</Provider>
			</SocketProvider>
		);
	}
}

@observer
@socketConnect
class AppContent extends React.Component<DefaultProps> {

	constructor(props: any){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		setTimeout( () => this.forceUpdate(), 10)
	}

	render(){
		console.log('props', this.props)
		return <div className="App">
			<RouterComponent />
		</div>
	}
}