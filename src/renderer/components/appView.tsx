import * as React from 'react';
import { AppState } from '../store/store';
import { connect} from 'react-redux';
import AppHeader from './appHeader';
import { AppData } from '../store/reducers/appData';




interface OwnProps {
    background?: string
}

interface ReduxProps {
    appData: AppData
}


export type AppViewProps = OwnProps & ReduxProps;

interface State {
}


export class AppView extends React.Component<AppViewProps, State>{
    constructor(props: AppViewProps) {
        super(props);

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
            </div>
        )
    }
}




export default connect((state: AppState, props) => {
    return {
        appData: state.appData
    };
})(AppView);