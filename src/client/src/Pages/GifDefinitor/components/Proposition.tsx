import * as React from 'react';

interface PropositionProps {
    content: string
    onClick?: Function
    className?: string
    selected?: boolean
}
interface PropositionState {
}

class Proposition extends React.Component <PropositionProps, PropositionState> {

    constructor(props: PropositionProps){
        super(props)
        this.state = {
        }
    }

    render() {
        console.log('content of prop', this.props.content)
        return (
            <div className={ "proposition" 
                + (this.props.className ? ' ' + this.props.className : '') 
                + (this.props.selected ? ' proposition-selected' : '')
            }>
                <div className='proposition-content'
                    onClick={() => this.props.onClick && this.props.onClick()}
                >
                    {this.props.content} 
                </div>
            </div>
        );
    }
}

export default Proposition;
