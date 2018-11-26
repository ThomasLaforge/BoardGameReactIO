import * as React from 'react';

interface GameFormProps {
}
interface GameFormState {
}

class GameForm extends React.Component <GameFormProps, GameFormState> {

    constructor(props: GameFormProps){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="lobby-game-creator">
                <div className="lobby-game-creator-form"></div>
            </div>
        );
    }
}

export default GameForm;
