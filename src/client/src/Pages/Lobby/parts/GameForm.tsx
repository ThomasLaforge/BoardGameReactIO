import * as React from 'react';
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from 'src/mobxInjector';

interface GameFormProps extends DefaultProps{
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
        // let GameFormComponent = this.props.games[0].formComponent
        return (
            <div className="lobby-game-creator">
                <div className="lobby-game-creator-form">
                    {/* <GameFormComponent /> */}
                </div>
            </div>
        );
    }
}

export default GameForm;
