import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppHeader from '../components/appHeader';
import ImageInput from '../components/imageInput';
import { ISO639Locale } from '@axc/react-components/display/i18string';
import { withHistoryContext, MemoryHistory } from '@axc/react-components/navigation/memoryRouter';
import { connect } from 'react-redux';
import { AppData } from '../store/reducers/appData';
import { AppState } from '../store/store';
import { resetAppData, setLocale, setAppBackground, setAppAutoSave,setAppAutoSaveInterval } from '../actions/appData';
import { ActionCreator } from 'redux';



interface OwnProps {
    onClose: Function;
    isOpen: boolean;
}
interface ReduxProps {
    data: AppData,
    resetAppData: typeof resetAppData,
    setLocale: typeof setLocale,
    setAppBackground: typeof setAppBackground,
    setAppAutoSave: typeof setAppAutoSave,
    setAppAutoSaveInterval: typeof setAppAutoSaveInterval
}

type SettingsProps = OwnProps & ReduxProps;

interface SettingsState {
    background: string,
    locale: string,
    autoSave: boolean
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
        this.props.setAppBackground(background);
    }
    onAutoSaveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const shouldAutoSave = event.target.value === 'true';
        console.log('Should auto save? ', shouldAutoSave, event.target);
        this.props.setAppAutoSave(shouldAutoSave);
    }
    onAutoSaveIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newInterval = Number(event.target.value);
        if(newInterval < 1){
            newInterval = 1;
        }
        this.props.setAppAutoSaveInterval(newInterval);
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
                    <div className='form-field'>
                        Language
                        <select
                            className='form-input select-input'
                            value={this.props.data.locale}
                            onChange={this.onLocaleChange}
                        >
                            {Object.keys(ISO639Locale).map((locale) => {
                                return (
                                    <option key={locale} value={locale}>{locale}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className='form-field'>
                        Auto save articles?
                        <select
                            className='form-input select-input'
                            value={String(this.props.data.shouldAutoSave)}
                            onChange={this.onAutoSaveChange}
                        >
                            <option key='false' value='false'>False</option>
                            <option key='true' value='true'>True</option>
                        </select>
                    </div>

                    {this.props.data.shouldAutoSave ?
                        <div className='form-field'>
                            Auto save interval <input style={{width: '50px'}}className='form-input number-input' type="number" value={this.props.data.autoSaveInterval} onChange={this.onAutoSaveIntervalChange} /> Minutes
                        </div>
                        :
                        null
                    }
                    <div className='form-field'>
                        Background Image
                        <ImageInput
                            className='form-input image-input'
                            windowTitle='select App background image'
                            value={this.props.data.background}
                            onChange={this.onBackgroundChange}
                        >
                            select
                        </ImageInput>
                    </div>

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
        setAppBackground,
        setAppAutoSave,
        setAppAutoSaveInterval
    }
)(SettingsForm);