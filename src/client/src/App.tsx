import * as React from 'react';
import './App.css';

import { SocketProvider, socketConnect } from 'socket.io-react';
import * as io from 'socket.io-client';

const uri = 'http://localhost:3000';
const options = { transports: ['websocket'] };
// let socket = io.connect(uri, options)
let socket = io.connect(uri, options)

class App extends React.Component {

	componentDidMount(){
		this.forceUpdate()
	}

	public render() {
		return (
			<SocketProvider socket={socket}> 
				<SocketTester />
			</SocketProvider >
		);
	}
}

interface SocketTesterProps {
	socket?: any
}

interface SocketTesterState {
}

@socketConnect
class SocketTester extends React.PureComponent<SocketTesterProps, SocketTesterState> {

	constructor(props: any){
        super(props)
        this.state = {}
	}

	componentDidMount(){
		setTimeout( () => this.forceUpdate(), 10)
	}

	render(){
		// if(this.props.socket){
			console.log('props', this.props.socket.connected,  this.props.socket)
			this.props.socket.connected && this.props.socket.emit('message', 'hello')
		// }
		return <div className="App">
			Hello world ! Your ID is {this.props.socket ? this.props.socket.id : 'nothing'}
		</div>
	}
}

export default App;
