import React, { Component } from 'react'

interface StackProps {
    value: number | null
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
      <div className='stack'>
        {this.props.value || '-'}
      </div>
    )
  }
}

export default Stack