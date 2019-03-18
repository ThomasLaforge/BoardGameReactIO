import * as React from 'react'
import { Color, Shape as SetShape, Filling } from 'boardgamereactio-common/Set/definitions';

import './style.scss'

interface ShapeProps {
    color: Color
    type: SetShape
    filling: Filling
}
interface ShapeState {
}

export class Shape extends React.Component<ShapeProps, ShapeState> {

    constructor(props: ShapeProps) {
        super(props)
        this.state = {
        }  
    }

    getClassColor(){
        switch (this.props.color) {
            case Color.Green: return 'shape-color-green' 
            case Color.Purple: return 'shape-color-purple' 
            case Color.Red: return 'shape-color-red'             
        }
    }

    getClassFilling(){
        switch (this.props.filling) {
            case Filling.Empty: return 'shape-filling-empty' 
            case Filling.Striped: return 'shape-filling-striped' 
            case Filling.Full: return 'shape-filling-full'         
        }
    }

    render() {
        const { type } = this.props
        return (
            <div className={'set-shape' + ' ' +  this.getClassColor() + ' ' + this.getClassFilling()}>
                {type}
            </div>
        )
    }
}

export default Shape