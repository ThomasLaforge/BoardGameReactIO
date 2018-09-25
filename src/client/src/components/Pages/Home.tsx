import * as React from 'react';
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

interface HomeProps extends DefaultProps {
}
interface HomeState {
}

@inject(injector)
@observer
class Home extends React.Component <HomeProps, HomeState> {

    constructor(props: HomeProps){
        super(props)
        this.state = {}
    }

    defaultOnClick = () => {
        console.log('click on menu item')
    }

    render() {
        return (
            <div className="home">
                Home
            </div>
        );
    }
}

export default Home;
