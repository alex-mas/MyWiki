import * as React from 'react';
import { AppState } from '../store/store';
import { connect} from 'react-redux';
import AppHeader from './appHeader';
import { AppData } from '../store/reducers/appData';
import Notifications from './notifications';




interface OwnProps {
    background?: string,
    title: string
}

interface ReduxProps {
    appData: AppData
}


type ComponentProps = OwnProps & ReduxProps;

interface State {
}


export class AppView extends React.Component<ComponentProps, State>{
    constructor(props: ComponentProps) {
        super(props);

    }
    componentDidMount(){
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = this.props.title;
    }
    getBackground = () => {
        let background;
        //let the caller provide a customized background
        if (this.props.background) {
            background = this.props.background;
        } else if (this.props.appData.background) {
            background = this.props.appData.background;
        } else {
            //fallback
        }
        return background;
    }
    render() {
        return (
            <div className='route'>
                <img className='route__background' src={this.getBackground()} alt="background" />
                <AppHeader />
                {this.props.children}
                <Notifications />
            </div>
        )
    }
}




export default connect((state: AppState, props) => {
    return {
        appData: state.appData
    };
})(AppView);