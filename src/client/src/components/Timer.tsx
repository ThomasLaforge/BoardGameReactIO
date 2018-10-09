import * as React from 'react';

interface TimerProps {
    duration: number
}
interface TimerState {
    remainingTime: number
}

class Timer extends React.Component <TimerProps, TimerState> {

    interval: any

    constructor(props: TimerProps){
        super(props)
        this.state = {
            remainingTime: this.props.duration
        }
    }

    componentDidMount(){
        this.interval = setInterval( () => {
            console.log('interval')
            if(this.state.remainingTime === 0){
                clearInterval(this.interval)
            }
            else{
                this.setState({ remainingTime : this.state.remainingTime - 1 })
            }
        }, 1000)
    }

    render() {
        return (
            <div className="timer">
                <div className="timer-value">
                    Next run starts in {this.state.remainingTime} seconds
                </div>
            </div>
        );
    }
}

export default Timer;
