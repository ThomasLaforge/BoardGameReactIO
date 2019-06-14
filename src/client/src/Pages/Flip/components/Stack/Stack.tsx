import React, { Component } from 'react'

interface StackProps {
    value: number | null
    onClick: Function
}
interface StackState {
}

export class Stack extends Component<StackProps, StackState> {

    constructor(props: StackProps) {
        super(props)
        this.state = {
        }  
    }

  render() {
    return (
      <div className='stack' onClick={() => this.props.onClick()}>
        {this.props.value || '-'}
      </div>
    )
  }
}

export default Stack