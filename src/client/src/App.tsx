import { socketConnect, SocketProvider } from 'socket.io-react';

import * as React from 'react';
import * as io from 'socket.io-client';
import RouterComponent from './Router/RouterComponent';
import { Provider, observer } from 'mobx-react';
import { Store } from './Stores/Store';
import { DefaultProps } from './mobxInjector';

import './App.scss';

import LimiteLimiteGame from "./Pages/LimiteLimite/Game";
import LimiteLimiteForm from "./Pages/LimiteLimite/GameForm"
import TarotCongolaisGame from './Pages/TarotCongolais/Game'
import TarotCongolaisForm from "./Pages/TarotCongolais/GameForm"
import GifDefinitorGame from './Pages/GifDefinitor/Game'
import SetGame from './Pages/Set/Game'
import SetForm from "./Pages/Set/GameForm"
import FlipGame from './Pages/Flip/Game'
import FlipForm from "./Pages/Flip/GameForm"

const uri = location.protocol + '//' + location.hostname + ':3027';
// console.log('path of api', location, uri)

// const options = { transports: ['websocket'] };
// const socket = io.connect(uri, options)
const socket = io.connect(uri)

interface GameModule {
	path: string,
	name: string,
	component: any,
	formComponent?: any
}

let games: GameModule[] = [
	{
		path: '/limitelimite',
		name: 'limitelimite',
		component: LimiteLimiteGame,
		formComponent: LimiteLimiteForm
	},
	{
		path: '/tarotcongolais',
		name: 'tarotcongolais',
		component: TarotCongolaisGame,
		formComponent: TarotCongolaisForm
	},
	{
		path: '/gifdefinitor',
		name: 'gifdefinitor',
		component: GifDefinitorGame,
	},
	{
		path: '/set',
		name: 'set',
		component: SetGame,
		formComponent: SetForm
	},
	{
		path: '/flip',
		name: 'flip',
		component: FlipGame,
		formComponent: FlipForm
	}
]

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