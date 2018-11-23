import * as React from 'react';

import './proposition.scss'

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
        return (
            <div className={ "proposition" 
                    + (this.props.className ? ' ' + this.props.className : '') 
                    + (this.props.selected ? ' proposition-selected' : '')
                }
                onClick={() => this.props.onClick && this.props.onClick()}
            >
                <div className='proposition-content'
                >
                    {this.props.content} 
                </div>
            </div>
        );
    }
}

export default Proposition;
