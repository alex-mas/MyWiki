import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppHeader from '../components/appHeader';
import ImageInput from '../components/imageInput';
import { ISO639Locale } from '@axc/react-components/display/i18string';
import { withHistoryContext, MemoryHistory } from '@axc/react-components/navigation/memoryRouter';
import { connect } from 'react-redux';
import { AppData } from '../store/reducers/appData';
import { AppState } from '../store/store';
import {resetAppData, setLocale, setAppBackground } from '../actions/appData';
import { ActionCreator } from 'redux';



interface OwnProps {
    onClose: Function;
    isOpen: boolean;
}
interface ReduxProps {
    data: AppData,
    resetAppData:  typeof resetAppData,
    setLocale: typeof setLocale,
    setAppBackground: typeof setAppBackground
}

type SettingsProps = OwnProps & ReduxProps;

interface SettingsState {
    background: string,
    locale: string
}

export class SettingsForm extends React.Component<SettingsProps, SettingsState>{
    constructor(props: SettingsProps) {
        super(props);
    }
    onLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const locale = event.target.value;
        this.props.setLocale(locale as ISO639Locale);
    }
    onBackgroundChange = (background: string) => {
        this.props.setAppBackground( background
        );
    }
    onResetValues = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.resetAppData();
        this.props.onClose();
    }
    onConfirmChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onClose();
    }
    render() {
        if (this.props.isOpen) {
            return (
                <form className='settings-form'>
                    <select
                        className='form-input'
                        value={this.props.data.locale}
                        onChange={this.onLocaleChange}
                    >
                        {Object.keys(ISO639Locale).map((locale) => {
                            return (
                                <option key={locale} value={locale}>{locale}</option>
                            );
                        })}
                    </select>
                    <ImageInput
                        className='form-input'
                        windowTitle='select App background image'
                        value={this.props.data.background}
                        onChange={this.onBackgroundChange}
                    >
                        Background Image
                    </ImageInput>
                    <button
                        className='form-action'
                        type='button'
                        onClick={this.onConfirmChanges}
                    >
                        Confirm
                 </button>
                    <button
                        className='form-action'
                        type='button'
                        onClick={this.onResetValues}
                    >
                        Reset
                 </button>
                </form>
            )
        } else {
            return null;
        }

    }
}


export default connect(
    (state: AppState, props: OwnProps) => {
        return {
            data: state.appData
        }
    },
    {
        setLocale,
        resetAppData,
        setAppBackground
    }
)(SettingsForm);