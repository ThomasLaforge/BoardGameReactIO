import * as React from 'react';
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from 'src/mobxInjector';

interface GameFormProps extends DefaultProps {
    
}
interface GameFormState {

}

@inject(injector)
@observer
class GameForm extends React.Component <GameFormProps, GameFormState> {

    constructor(props: GameFormProps){
        super(props)
        this.state = {
        }
    }

    render() {
        let SpecificFormComponent = ( this.props.ui.selectedTypeIndex !== null && this.props.games[this.props.ui.selectedTypeIndex] && this.props.games[this.props.ui.selectedTypeIndex].formComponent)
            ? this.props.games[this.props.ui.selectedTypeIndex].formComponent
            : null
        return (
            <div className="lobby-game-creator">
                {SpecificFormComponent 
                    ? <SpecificFormComponent /> 
                    : <div className="lobby-game-default-creator-form">
                        Select a game type to create a game
                    </div>
                }
            </div>
        );
    }
}

export default GameForm;
