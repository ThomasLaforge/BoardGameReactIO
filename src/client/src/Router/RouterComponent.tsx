import * as React from 'react';
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'

interface RouterProps extends DefaultProps {
}
interface RouterState {
}

@inject(injector)
@observer
class RouterComponent extends React.Component <RouterProps, RouterState> {

    constructor(props: RouterProps){
        super(props)
        this.state = {}
    }

    render() {
        let MyComponent = this.props.ui.router.currentRoute.component
        return (
            <div className="router">
                <MyComponent />
            </div>
        );
    }
}

export default RouterComponent;
