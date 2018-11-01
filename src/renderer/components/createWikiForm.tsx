import * as React from 'react';
import { connect } from 'react-redux';
import { WikisMetadataReducer, WikiMetaData } from '../store/reducers/wikis';
import { remote, Dialog, OpenDialogOptions } from 'electron';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import { createWiki, CreateWikiActionCreator, UserWikiData } from '../actions/wikis';
import { MemoryHistory, withHistoryContext } from '@axc/react-components/navigation/memoryRouter';
import { encode } from 'punycode';
import { ImageInput } from './imageInput';


const accessFile = util.promisify(fs.access);

const dialog: Dialog = remote.dialog;


export interface CreateWikiFormOwnProps {
    history: MemoryHistory;
}

export interface CreateWikiFormDispatchProps {
    fsError: FsErrorActionCreator,
    createWiki: CreateWikiActionCreator
}
export interface CreateWikiFormState extends UserWikiData {
}

export class CreateWikiForm extends React.Component<CreateWikiFormOwnProps & CreateWikiFormDispatchProps, CreateWikiFormState>{
    constructor(props: CreateWikiFormOwnProps & CreateWikiFormDispatchProps) {
        super(props);
        this.state = {
            name: undefined,
            description: undefined,
            background: undefined
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
        this.props.createWiki(this.state);
        this.props.history.pushState('/');
    }
    onBackgroundChange = (newBackground: string) => {
        this.setState(() => ({
            background: newBackground
        }));
    }
    render() {
        return (
            <form className='form' onSubmit={this.onSubmitForm}>
                <div className='form-field'>
                    <input className='form-input' type="text" placeholder='name' value={this.state.name} onChange={this.onNameChange} />
                </div>
                <div className='form-field'>
                    <input className='form-input' type="text" placeholder='description' value={this.state.description} onChange={this.onDescriptionChange} />
                </div>
                <div className='form-field'>
                    <ImageInput
                        value={this.state.background}
                        placeholder='Choose a background image'
                        onChange={this.onBackgroundChange}
                        prompt='Choose Image'
                        windowTitle='Choose a background image'
                    />
                    <img className='background-image-preview' style={{ height: '150px', width: '150px' }} src={this.state.background} />
                </div>

                <button className='form action' type='submit'>Submit</button>
            </form>
        );

    }
}




export default withHistoryContext(connect<{}, CreateWikiFormDispatchProps, CreateWikiFormOwnProps, CreateWikiFormState>(undefined, {
    fsError,
    createWiki
})(CreateWikiForm));
