import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import { MemoryRouteProps } from '@axc/react-components/dist/navigation/memoryRouter';
import { Change, Value } from 'slate';
import { CreateArticleActionCreator, createArticle } from '../actions/article';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import Header from '../components/header';
import TagForm from '../components/tagForm';
import { SelectedWiki } from '../store/reducers/selectedWiki';
import { ImageInput } from '../components/imageInput';

export interface CreateArticlePageDispatchProps {
    createArticle: CreateArticleActionCreator,
    fsError: FsErrorActionCreator
}


export interface CreateArticlePageStateProps {
    selectedWiki: SelectedWiki
}

export interface CreateArticlePageOwnProps extends MemoryRouteProps {
}

export type CreateArticlePageProps = CreateArticlePageOwnProps & CreateArticlePageDispatchProps & CreateArticlePageStateProps;


export interface CreateArticlePageState {
    editorContent: Value,
    background: string,
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
            background: undefined,
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
        this.setState(() => ({
            tags: newTags
        }));

    }
    toggleTagManagement = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState((prevState) => ({
            areTagsBeingManaged: !prevState.areTagsBeingManaged
        }));
    }
    createArticle = () => {
        this.props.createArticle({
            name: this.state.name,
            content: JSON.stringify(this.state.editorContent),
            tags: this.state.tags,
            background: this.state.background
            //@ts-ignore
        }).then(() => {
            this.props.history.pushState(`/wiki/article/${this.state.name}`);
        });
    }
    onBackgroundChange = (newBackground: string) => {
        this.setState(() => ({
            background: newBackground
        }));
    }
    render() {
        return (
            <div className='wiki-route'>
                <img className='wiki-background' src={this.state.background ? this.state.background : this.props.selectedWiki.background} alt="" />
                <Header>
                    <div>
                        <i className='wiki-header__icon'>placeholder</i>
                        {this.props.routeParams.article ? null : <input type="text" value={this.state.name} onChange={this.onNameChange} />}
                    </div>
                </Header>

                <div className='body--article'>
                    <div className='wiki-article__header'>
                        <h1 className='wiki-article__title'>{this.state.name ? this.state.name : 'New Article'}</h1>
                        <div className='wiki-article__actions'>
                            <button onClick={this.createArticle}>
                                Create article
                            </button>
                            <button onClick={this.toggleTagManagement}>Manage tags</button>
                            <ImageInput
                                prompt='Choose Background'
                                onChange={this.onBackgroundChange}
                                windowTitle='Choose a background for the article'
                            />
                        </div>
                        <TagForm
                            toggled={this.state.areTagsBeingManaged}
                            tags={this.state.tags}
                            onChange={this.onChangeTags}
                        />
                    </div>

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


