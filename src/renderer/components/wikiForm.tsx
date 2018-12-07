import * as React from 'react';
import { connect } from 'react-redux';
import { WikisMetadataReducer, WikiMetadata, UserDefinedWikiMetadata } from '../store/reducers/wikis';
import { remote, Dialog, OpenDialogOptions } from 'electron';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import { createWiki, CreateWikiActionCreator } from '../actions/wikis';
import { MemoryHistory, withHistoryContext } from '@axc/react-components/navigation/memoryRouter';
import { encode } from 'punycode';
import { ImageInput } from './imageInput';
import I18String from '@axc/react-components/display/i18string';
import { Button } from './button';


const accessFile = util.promisify(fs.access);

const dialog: Dialog = remote.dialog;


interface OwnProps {
    onSubmit: (value: ComponentState) => any;
    onClose: Function;
    initialValues?: WikiMetadata
}

interface ComponentState extends UserDefinedWikiMetadata {
}

export class WikiForm extends React.Component<OwnProps, ComponentState>{
    constructor(props: OwnProps) {
        super(props);
        if (props.initialValues) {
            this.state = {
                name: props.initialValues.name,
                description: props.initialValues.description,
                background: props.initialValues.background
            }

        } else {
            this.state = {
                name: undefined,
                description: undefined,
                background: undefined
            }
        }


    }
    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        this.setState((prevState) => ({
            name
        }));
    }
    onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const description = event.target.value;
        this.setState((prevState) => ({
            description
        }));
    }
    onSubmitForm = (event: React.FormEvent) => {
        event.preventDefault();
        this.props.onSubmit(this.state);
    }
    onBackgroundChange = (newBackground: string) => {
        this.setState(() => ({
            background: newBackground
        }));
    }
    render() {
        return (
            <form className='form' onSubmit={this.onSubmitForm}>
                <div className='form__field'>
                    <I18String text='wiki name' format='capitalizeFirst' /> <input className='form__text-input' type="text" placeholder='name' value={this.state.name} onChange={this.onNameChange} />
                </div>
                <div className='form__field'>
                    <I18String text='wiki description' format='capitalizeFirst' /> <input className='form__text-input' type="text" placeholder='description' value={this.state.description} onChange={this.onDescriptionChange} />
                </div>
                <div className='form__field'>
                    <div className='form__field__label'>
                        <I18String text='choose a background image' format='capitalizeFirst' />
                        <img className='form__image-preview' src={this.state.background} />
                    </div>
                    <ImageInput
                        value={this.state.background}
                        onChange={this.onBackgroundChange}
                        prompt='choose Image'
                        windowTitle='Choose a background image'
                        className='form__image-input'
                    />

                </div>
                <div className='form__actions'>
                    <Button
                        btnType='solid'
                        theme='primary'
                        className='form__action'
                        type='submit'
                    >
                        <I18String text='submit' format='capitalizeFirst' />
                    </Button>
                </div>

            </form>
        );

    }
}




export default WikiForm;
