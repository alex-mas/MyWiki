import * as React from 'react';
import ImageInput from './imageInput';
import { ISO639Locale } from '@axc/react-components/display/i18string';
import { connect } from 'react-redux';
import { AppData } from '../store/reducers/appData';
import { AppState } from '../store/store';
import { setWikiBackground, setWikiName, setWikiDescription } from '../actions/wikis';




interface OwnProps {
    wikiID: string;
    onClose: Function;
    isOpen: boolean;
}
interface ReduxProps {
    name: string,
    description: string,
    background: string,
    setWikiBackground: typeof setWikiBackground,
    setWikiDescription: typeof setWikiDescription,
    setWikiName: typeof setWikiName
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
    onBackgroundChange = (background: string) => {
        this.props.setWikiBackground(this.props.wikiID, background);
    }
    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        this.props.setWikiName(this.props.wikiID, name);
    }
    onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const description = event.target.value;
        this.props.setWikiDescription(this.props.wikiID, description);
    }
    onConfirm = (event: React.MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault();
        this.props.onClose();
    }
    render() {
        if (this.props.isOpen) {
            return (
                <form className='wiki-settings-form'>
                    <input
                        className='form-input'
                        type="text"
                        value={this.props.name}
                        onChange={this.onNameChange}
                    />
                    <input
                        className='form-input'
                        type="text"
                        value={this.props.description}
                        onChange={this.onDescriptionChange}
                    />
                    <ImageInput
                        className='form-input'
                        windowTitle='select App background image'
                        value={this.props.background}
                        onChange={this.onBackgroundChange}
                    >
                        Background Image
                    </ImageInput>
                    <button
                        className='form-action' 
                        type='button'
                        onClick={this.onConfirm}
                    >
                        Confirm
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
        const wiki = state.wikis.find((_wiki) => _wiki.id === props.wikiID);
        return {
            name: wiki.name,
            background: wiki.background,
            description: wiki.description
        }
    },
    {
        setWikiDescription,
        setWikiName,
        setWikiBackground
    }
)(SettingsForm);