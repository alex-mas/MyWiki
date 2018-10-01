import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import WikiEditor, {defaultEditorContents} from '../components/wikiEditor/wikiEditor';
import { MemoryRouteProps } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { Change, Value } from 'slate';
import { CreateArticleActionCreator, createArticle } from '../actions/article';
import { fsError, FsErrorActionCreator } from '../actions/errors';

export interface CreateArticlePageDispatchProps {
    createArticle: CreateArticleActionCreator,
    fsError: FsErrorActionCreator
}


export interface CreateArticlePageStateProps {
    selectedWiki: WikiMetaData
}

export interface CreateArticlePageOwnProps extends MemoryRouteProps {
}

export type CreateArticlePageProps = CreateArticlePageOwnProps & CreateArticlePageDispatchProps & CreateArticlePageStateProps;


export interface CreateArticlePageState {
    editorContent: Value,
    name: string
}

export class CreateArticlePage extends React.Component<CreateArticlePageProps, CreateArticlePageState>{
    constructor(props: CreateArticlePageProps) {
        super(props);
        this.state = {
            editorContent: defaultEditorContents,
            name: undefined
        }
    }
    onChange = (change: Change) => {
        const editorContent = change.value;
        this.setState(() => ({ editorContent }));
    }
    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        this.setState(() => ({
            name
        }));
    }
    createArticle = () => {
        fs.access(path.join(this.props.selectedWiki.path, 'wikis','articles', this.state.name), fs.constants.F_OK, (err) => {
            if (!err) {
                this.props.fsError(`Wiki article named ${this.state.name} already exists, please rename or delete the existing article or change the name of this article`);
            } else {
                fs.writeFile(
                    path.join(this.props.selectedWiki.path,'articles', `${this.state.name}.json`), 
                    JSON.stringify(this.state.editorContent), 
                    'utf8',
                    (error)=>{
                        if(error){
                            this.props.fsError(`Error trying to create article ${this.state.name}, please try running the app as administrator. If that doesn't work contact the developer`);
                        }else{
                            this.props.history.pushState(`/wiki/article/${this.state.name}`);
                        }
                    }
                );
            }
        })
    }
    render() {
        return (
            <div>
                <h1>{this.state.name ? this.state.name : 'New Article'}</h1>
                <input type="text" value={this.state.name} onChange={this.onNameChange} />
                <WikiEditor
                    content={this.state.editorContent}
                    onChange={this.onChange}
                    readOnly={false}
                />
                <button onClick={this.createArticle}>
                    Create article
                </button>
            </div>
        )
    }
}



export default connect<CreateArticlePageStateProps, CreateArticlePageDispatchProps, CreateArticlePageOwnProps, AppState>(
    (state: AppState, props: CreateArticlePageOwnProps) => {
        return {
            selectedWiki: state.selectedWiki
        }
    },
    {
        fsError,
        createArticle
    }
)(CreateArticlePage);


