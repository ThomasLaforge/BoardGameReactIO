import * as React from 'react';
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from 'src/mobxInjector';

interface TypeSelectorProps extends DefaultProps {
}
interface TypeSelectorState {
}

@inject(injector)
@observer
class TypeSelector extends React.Component <TypeSelectorProps, TypeSelectorState> {

    constructor(props: TypeSelectorProps){
        super(props)
        this.state = {
        }
    }

    renderTypes(){
        console.log('selected type index', this.props.ui.selectedTypeIndex)
        return this.props.games.map( (g, i) => 
            <div className="lobby-type-selection-elt" key={i}>
                <div 
                    className={
                          "lobby-type-selection-elt-image"
                        + (this.props.ui.selectedTypeIndex === i ? " lobby-type-selection-elt-image_selected" : '')
                    }
                    onClick={() => this.props.ui.handleChangeSelectedTypeIndex(i)}
                >Image {g.name}</div>
                <div className="lobby-type-selection-elt-descriptor">
                    <div className="type-descriptor-title">
                        {g.name}
                    </div>
                    <div className="type-descriptor-description">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum eum beatae quia similique, saepe dolore, soluta sint vel doloremque dolorum aut. Corrupti consequatur explicabo quisquam, vitae aliquid aut modi laudantium.
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="lobby-type-selection">
                <div className="lobby-type-selection-title">
                    A quel jeu souhaites-tu jouer ?
                </div>
                <div className="lobby-type-selection-list">
                    {this.renderTypes()}
                </div>
            </div>
        );
    }
}

export default TypeSelector;