import { socketConnect, SocketProvider } from 'socket.io-react';

import * as React from 'react';
import * as io from 'socket.io-client';
import RouterComponent from './Router/RouterComponent';
import { Provider, observer } from 'mobx-react';
import { Store } from './Stores/Store';
import { DefaultProps } from './mobxInjector';
import DebugBox from './components/DebugBox';

import './App.scss';

const uri = location.origin + ':3027';
const options = { transports: ['websocket'] };
// let socket = io.connect(uri, options)
const socket = io.connect(uri, options)

interface AppProps extends DefaultProps {}

@observer
export default class App extends React.Component<AppProps, { store: Store, drawerOpened: boolean} > {

	constructor(props: any){
		super(props);
		this.state = {
			store: new Store(),
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
			{/* <DebugBox /> */}
		</div>
	}
}