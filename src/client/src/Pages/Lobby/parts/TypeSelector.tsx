import * as React from 'react';

interface TypeSelectorProps {
    selectedTypeIndex: number
}
interface TypeSelectorState {
}

class TypeSelector extends React.Component <TypeSelectorProps, TypeSelectorState> {

    constructor(props: TypeSelectorProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="lobby-type-selection">
                    <div className="lobby-type-selection-title"></div>
                    <div className="lobby-type-selection-list">
                        <div className="lobby-type-selection-elt">
                            <div className="lobby-type-selection-elt-image"></div>
                            <div className="lobby-type-selection-elt-descriptor">
                                <div className="type-descriptor-title"></div>
                                <div className="type-descriptor-description"></div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default TypeSelector;