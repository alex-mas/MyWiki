import * as React from 'react';
import { connect } from 'react-redux';
import { WikisMetadataReducer, WikiMetaData } from '../store/reducers/wikis';
import {remote, Dialog, OpenDialogOptions} from 'electron';
import * as fs from 'fs';
import * as util from 'util';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import { createWiki, CreateWikiActionCreator} from '../actions/wikis';
import { BrowserHistory } from '../../../../../libraries/alex components/dist/navigation/browserRouter';

const accessFile = util.promisify(fs.access);

const dialog: Dialog = remote.dialog;


export interface CreateWikiFormOwnProps {
    history: BrowserHistory;
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
            path: './wiki'
        }
    }
    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        this.setState((prevState) => ({
            name
        }));
    }
    onPathChange = (path: string) => {
        this.setState((prevState) => ({
            path
        }));
    }
    chooseWikiPath = (event: React.MouseEvent<HTMLButtonElement>) =>{
        dialog.showOpenDialog({
            title: 'Choose the wiki folder',
            defaultPath: './',
            buttonLabel: 'Confirm',
            properties: ['openDirectory','createDirectory','promptToCreate']
        },this.handleChosenWikiPath);
    }
    handleChosenWikiPath = async (filePaths: string[], bookmarks?: string[]) =>{
        const newFilePath = filePaths[0];
        accessFile(newFilePath, fs.constants.F_OK)
        .then(()=>{
            accessFile(newFilePath, fs.constants.W_OK)
            .then(()=>{
                this.onPathChange(newFilePath);
            })
            .catch((error)=>{
                this.props.fsError(error);
            });
        })
        //folder doesnt exist, create it
        .catch((e)=>{
            accessFile(newFilePath, fs.constants.W_OK)
            .then(()=>{
                fs.mkdirSync(newFilePath);
                this.onPathChange(newFilePath);
            })
            .catch((error)=>{
                this.props.fsError(error);
            });
        });
    }
    onSubmitForm = (event: React.FormEvent) => {
        event.preventDefault();
        this.props.createWiki(this.state.name, this.state.path);
        this.props.history.pushState('/');
    }
    render() {
        return (
            <form onSubmit={this.onSubmitForm}>
                <input type="text" value={this.state.name} onChange={this.onNameChange} />
                <button type='button' onClick={this.chooseWikiPath}>Choose a folder</button>
                <button type='submit'>Submit</button>
            </form>
        )
    }
}




export default connect<{}, CreateWikiFormDispatchProps, CreateWikiFormOwnProps, CreateWikiFormState>(undefined, {
    fsError,
    createWiki
})(CreateWikiForm);
