import * as React from 'react';;
import ImageInput from '../components/imageInput';
import I18String, { ISO639Locale } from '@axc/react-components/i18string';
import { connect } from 'react-redux';
import { AppData } from '../store/reducers/appData';
import { AppState } from '../store/store';
import { resetAppData, setLocale, setAppBackground, setAppAutoSave, setAppAutoSaveInterval } from '../actions/appData';
import { ActionCreator } from 'redux';
import Modal from '@axc/react-components/modal';
import { Button } from './button';



interface OwnProps {
    onClose: () => void;
    isOpen: boolean;
}
interface ReduxProps {
    appData: AppData,
    resetAppData: typeof resetAppData,
    setLocale: typeof setLocale,
    setAppBackground: typeof setAppBackground,
    setAppAutoSave: typeof setAppAutoSave,
    setAppAutoSaveInterval: typeof setAppAutoSaveInterval
}

type ComponentProps = OwnProps & ReduxProps;

interface ComponentState {
    background: string,
    locale: string,
    autoSave: boolean
}

export class SettingsForm extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
    }
    onLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const locale = event.target.value;
        this.props.setLocale(locale as ISO639Locale);
    }
    onBackgroundChange = (background: string) => {
        this.props.setAppBackground(background);
    }
    onAutoSaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const shouldAutoSave = event.target.checked;
        console.log('Should auto save? ', shouldAutoSave, event.target);
        this.props.setAppAutoSave(shouldAutoSave);
    }
    onAutoSaveIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newInterval = Number(event.target.value);
        if (newInterval < 1) {
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
        return (
            <Modal
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                className='modal'
            >
                <form className='form'>
                    <div className='form__field'>
                        <I18String text='language' format='capitalizeFirst' />
                        <select
                            className='form-input select-input'
                            value={this.props.appData.locale}
                            onChange={this.onLocaleChange}
                        >
                            {Object.keys(ISO639Locale).map((locale) => {
                                return (
                                    <option key={locale} value={locale}>{locale}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className='form__field'>

                        <I18String text='auto save articles' format='capitalizeFirst' />
                        <input
                            type='checkbox'
                            className='form-input checkbox-input'
                            checked={this.props.appData.shouldAutoSave}
                            onChange={this.onAutoSaveChange}
                        />
                    </div>

                    {this.props.appData.shouldAutoSave ?
                        <div className='form__field'>
                            <I18String
                                text='auto save interval'
                                format='capitalizeFirst'
                            />
                            <input
                                style={{ width: '50px' }}
                                className='form-input number-input'
                                type="number"
                                value={this.props.appData.autoSaveInterval}
                                onChange={this.onAutoSaveIntervalChange}
                            />
                            <I18String
                                text='minutes'
                                format='capitalizeFirst'
                            />
                        </div>
                        :
                        null
                    }
                    <div className='form__field'>
                        <I18String text='background image' format='capitalizeFirst' />
                        <ImageInput
                            className='form-input image-input'
                            windowTitle='select App background image'
                            value={this.props.appData.background}
                            onChange={this.onBackgroundChange}
                        >
                            <I18String text='select' format='capitalizeFirst' />
                        </ImageInput>
                    </div>
                    <div className='form__actions'>
                        <Button
                            btnType='solid'
                            theme='primary'
                            type='button'
                            className='form__action'
                            onClick={this.onConfirmChanges}
                        >
                            <I18String text='confirm' format='capitalizeFirst' />
                        </Button>
                        <Button
                            btnType='flat'
                            theme='primary'
                            mode='accent'
                            type='button'
                            className='form__action'
                            onClick={this.onResetValues}
                        >
                            <I18String text='reset' format='capitalizeFirst' />
                        </Button>
                    </div>
                </form>
            </Modal>

        )
    }
}


export default connect(
    (state: AppState, props: OwnProps) => {
        return {
            appData: state.appData
        }
    },
    {
        setLocale,
        resetAppData,
        setAppBackground,
        setAppAutoSave,
        setAppAutoSaveInterval
    }
     //@ts-ignore
)(SettingsForm);