import * as React from 'react';
import { connect } from 'react-redux';
import { WikisMetadataReducer, WikiMetaData } from '../store/reducers/wikis';
import { remote, Dialog, OpenDialogOptions } from 'electron';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import { createWiki, CreateWikiActionCreator } from '../actions/wikis';
import { MemoryHistory } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { encode } from 'punycode';

const accessFile = util.promisify(fs.access);

const dialog: Dialog = remote.dialog;


export interface CreateWikiFormOwnProps {
    history: MemoryHistory;
}

export interface CreateWikiFormDispatchProps {
    fsError: FsErrorActionCreator,
    createWiki: CreateWikiActionCreator
}
export interface CreateWikiFormState extends Pick<WikiMetaData, Exclude<keyof WikiMetaData, 'id'>> {
}

export class CreateWikiForm extends React.Component<CreateWikiFormOwnProps & CreateWikiFormDispatchProps, CreateWikiFormState>{
    constructor(props: CreateWikiFormOwnProps & CreateWikiFormDispatchProps) {
        super(props);
        this.state = {
            name: 'defaultWiki',
            path: './wiki',
            background: '../../../resources/images/radiant.png'
        }
    }
    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        this.setState((prevState) => ({
            name
        }));
    }
    onSubmitForm = (event: React.FormEvent) => {
        event.preventDefault();
        this.props.createWiki(this.state.name, this.state.background);
        this.props.history.pushState('/');
    }
    changeBackgroundImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: 'Choose a background image',
            filters: [{
                name: 'images',
                extensions: ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', '.webp']
            }],
            properties: ['openFile']
        },
            (filePaths: string[]) => {

                if (filePaths.length === 1) {
                    const background = path.relative(__dirname, filePaths[0]);
                    console.log('relative path encoded: ', encodeURI(path.relative(__dirname, filePaths[0])));
                    console.log('absolute path encoded: ', encodeURI(filePaths[0]));
                    console.log('Value:', background);
                    this.setState(() => ({
                        background
                    }));
                }
            });
    }
    render() {
        return (
            <form className='form' onSubmit={this.onSubmitForm}>
                <div className='form-field'>
                    <input className='form-input' type="text" placeholder='wiki name' value={this.state.name} onChange={this.onNameChange} />
                </div>
                <div className='form-field'>
                    <span className='dialog-input'>{this.state.background}</span>
                    <button type='button' onClick={this.changeBackgroundImage}>Change background image</button>
                    <img className='background-image-preview' style={{ height: '150px', width: '150px' }} src={this.state.background} alt="Preview" />
                </div>

                <button className='form action' type='submit'>Submit</button>
            </form>
        )
    }
}




export default connect<{}, CreateWikiFormDispatchProps, CreateWikiFormOwnProps, CreateWikiFormState>(undefined, {
    fsError,
    createWiki
})(CreateWikiForm);
