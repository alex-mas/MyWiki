import * as React from 'react';
import { AppState } from '../store/store';
import { connect } from 'react-redux';
import { AppData } from '../store/reducers/appData';
import PageActions from './pageActions';
import AppSettingsForm from './appSettingsForm';
import AppHeader from './appHeader';




interface OwnProps {
    background?: string,
    title: string
}

interface ReduxProps {
    appData: AppData
}


type ComponentProps = OwnProps & ReduxProps;

interface State {
    isSettingsModalOpen: boolean
}


export class AppView extends React.Component<ComponentProps, State>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            isSettingsModalOpen: false
        }

    }
    componentDidMount() {
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
    openAppSettings = () => {
        this.setState((s) => ({
            isSettingsModalOpen: true
        }));
    }
    closeAppSettings = () => {
        this.setState((s) => ({
            isSettingsModalOpen: false
        }));
    }
    render() {
        return (
            <div className='route'>
                <AppHeader>
                    <button
                        onClick={this.openAppSettings}
                        className='page-action button-flat--secondary'
                    >
                        <i className='material-icons'>settings</i>
                    </button>
                </AppHeader>
                <div className='route__content'>
                    <img className='route__background' src={this.getBackground()} alt="background" />
                    {this.props.children}

                    <AppSettingsForm
                        isOpen={this.state.isSettingsModalOpen}
                        onClose={this.closeAppSettings}
                    />
                </div>

            </div>
        )
    }
}




export default connect((state: AppState, props) => {
    return {
        appData: state.appData
    };
})(AppView);