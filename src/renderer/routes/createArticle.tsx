import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import { MemoryRouteProps } from '@axc/react-components/navigation/memoryRouter';
import { Change, Value } from 'slate';
import { CreateArticleActionCreator, createArticle } from '../actions/article';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import Header from '../components/header';
import TagForm from '../components/tagForm';
import { SelectedWiki } from '../store/reducers/selectedWiki';
import { ImageInput } from '../components/imageInput';
import WikiHeader from '../components/wikiHeader';

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
            content: this.state.editorContent.toJSON(),
            tags: this.state.tags,
            background: this.state.background
            //@ts-ignore
        }).then(() => {
            this.props.history.pushState(`/wiki/article/${this.state.name}`);
        });
    }
    discardChanges = () => {
        this.props.history.back();
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
                <WikiHeader/>
                <div className='body--article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'>
                                Creating: {this.props.routeParams.article ?
                                    this.state.name
                                    :
                                    <input
                                        className='wiki-article__header-input'
                                        type="text"
                                        value={this.state.name}
                                        onChange={this.onNameChange}
                                        placeholder='Article Name'
                                    />
                                }

                            </h1>
                            <div className='wiki-article__actions'>
                                <button onClick={this.createArticle}>
                                    <i className='material-icons'>check</i>
                                </button>
                                <button onClick={this.discardChanges}>
                                    <i className='material-icons'>clear</i>
                                </button>
                                <button
                                    onClick={this.toggleTagManagement}
                                >
                                    <i className='material-icons'>local_offer</i>
                                </button>
                                <ImageInput
                                    prompt='Choose Background'
                                    onChange={this.onBackgroundChange}
                                    windowTitle='Choose a background for the article'
                                    className='wiki-article__image-input'
                                >
                                    <i className='material-icons'>panorama</i>
                                </ImageInput>
                            </div>
                        </div>
                        <div className='wiki-article__header__section'>
                            <TagForm
                                toggled={this.state.areTagsBeingManaged}
                                tags={this.state.tags}
                                onChange={this.onChangeTags}
                            />
                        </div>
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


