import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import { MemoryRouteProps } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { Change, Value } from 'slate';
import { CreateArticleActionCreator, createArticle } from '../actions/article';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import Header from '../components/header';
import TagForm from '../components/tagForm';

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
    name: string,
    tags: string[],
    areTagsBeingManaged: boolean
}

export class CreateArticlePage extends React.Component<CreateArticlePageProps, CreateArticlePageState>{
    constructor(props: CreateArticlePageProps) {
        super(props);
        this.state = {
            editorContent: defaultEditorContents,
            name: this.props.routeParams.article,
            tags: [],
            areTagsBeingManaged: false
        }
    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = `${this.props.selectedWiki.name} - Create article ${this.state.name ? '(' + this.state.name + ')' : ''}`;
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
    onChangeTags = (newTags: string[]) => {
        this.setState(()=>({
            tags: newTags
        }));

    }
    toggleTagManagement = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState((prevState) => ({
            areTagsBeingManaged: !prevState.areTagsBeingManaged
        }));
    }
    createArticle = () => {
        this.props.createArticle(this.state.name, JSON.stringify(this.state.editorContent), this.state.tags)
            //@ts-ignore
            .then(() => {
                this.props.history.pushState(`/wiki/article/${this.state.name}`);
            });
    }
    render() {
        return (
            <div className='wiki-route'>
                <Header>
                    <input type="text" value={this.state.name} onChange={this.onNameChange} />
                    <button onClick={this.createArticle}>
                        Create article
                    </button>
                    <button onClick={this.toggleTagManagement}>Manage tags</button>
                </Header>
                <TagForm
                    toggled={this.state.areTagsBeingManaged}
                    tags={this.state.tags}
                    onChange={this.onChangeTags}
                />
                <div className='body--article'>
                    <h1 className='wiki-article__title'>{this.state.name ? this.state.name : 'New Article'}</h1>
                    <div className='wiki-article__body--editor'>
                        <WikiEditor

                            content={this.state.editorContent}
                            onChange={this.onChange}
                            readOnly={false}
                        />
                    </div>

                </div>
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


