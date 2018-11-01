import * as React from 'react';
import AppHeader from '../components/appHeader';
import ImageInput from '../components/imageInput';
import { ISO639Locale } from '@axc/react-components/display/i18string';
import { withHistoryContext, MemoryHistory } from '@axc/react-components/navigation/memoryRouter';
import { connect } from 'react-redux';
import { AppData } from '../store/reducers/appData';
import { AppState } from '../store/store';
import { setAppData, resetAppData, AppDataActionCreator } from '../actions/appData';
import { ActionCreator } from 'redux';

interface HistoryProps {
    history: MemoryHistory
}
interface OwnProps {

}
interface ReduxProps {
    data: AppData,
    setAppData: AppDataActionCreator,
    resetAppData: ActionCreator<void>
}

type SettingsProps = HistoryProps & OwnProps & ReduxProps;

interface SettingsState {
    background: string,
    locale: string
}

export class SettingsPage extends React.Component<SettingsProps, SettingsState>{
    constructor(props: SettingsProps) {
        super(props);
        this.state = {
            background: props.data.background,
            locale: props.data.locale
        };
    }
    onLocaleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const locale = event.currentTarget.value;
        this.setState(() => ({
            locale
        }));
    }
    onBackgroundChange = (background: string) => {
        this.setState(() => ({
            background
        }));
    }
    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.setAppData(this.state)
        this.props.history.pushState('/');
    }
    onResetValues = (event: React.MouseEvent<HTMLButtonElement>)=>{
        this.props.resetAppData();
        this.props.history.pushState('/');
    }
    onDiscardChanges = (event: React.MouseEvent<HTMLButtonElement>)=>{
        this.props.history.pushState('/');
    }
    render() {
        return (
            <div className='wiki-route'>
                <AppHeader />
                <div className='body'>
                    <img className='wiki-background' src={this.state.background} alt="" />
                    <form className='settings-page' onSubmit={this.onSubmit}>
                        <select
                            value={this.state.locale}
                            onChange={this.onLocaleChange}
                        >
                            {Object.keys(ISO639Locale).map((locale) => {
                                return (
                                    <option key={locale} value={locale}>{locale}</option>
                                );
                            })}
                        </select>
                        <ImageInput
                            windowTitle='select App background image'
                            value={this.state.background}
                            onChange={this.onBackgroundChange}
                        >
                            Background Image
                        </ImageInput>
                        <button type='submit'>Confirm</button>
                        <button
                            type='button'
                            onClick={this.onDiscardChanges}
                        >
                            Cancel
                         </button>
                         <button
                            type='button'
                            onClick={this.onResetValues}
                        >
                            Reset
                         </button>
                    </form>
                </div>
            </div>
        )
    }
}


export default withHistoryContext(connect((state: AppState,props: OwnProps)=>{
    return{
        data: state.appData,
        
    }
}, {
    setAppData,
    resetAppData
})(SettingsPage));