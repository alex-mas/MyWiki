import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../../router/router';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import WikiEditor, { defaultEditorContents } from '../../components/wikiEditor/wikiEditor';
import * as ReactMarkdown from 'react-markdown';
import {Value } from 'slate';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import Header from '../../components/header';
import AppHeader from '../../components/appHeader';
import { loadArticle,LoadArticleActionCreator, Article, saveArticle, SaveArticleActionCreator, ArticleMetaData } from '../../actions/article';
import TagForm from '../../components/tagForm';
import { getArticle } from '../../selectors/articles';
import { ImageInput } from '../../components/imageInput';
import WikiHeader from '../../components/wikiHeader';
import { WikiMetaData } from '../../store/reducers/wikis';
import { AppData } from '../../store/reducers/appData';



export interface WikiEditPageDispatchProps {
    loadArticle: LoadArticleActionCreator,
    saveArticle: SaveArticleActionCreator
}

export interface WikiEditPageOwnProps extends MemoryRouteProps {
}

export interface WikiEditPageReduxProps {
    selectedWiki: WikiMetaData,
    article: ArticleMetaData,
    appData: AppData
}


export interface WikiEditPageProps extends WikiEditPageOwnProps, WikiEditPageReduxProps, WikiEditPageDispatchProps {
}

export interface WikiEditPageState {
    editorContent: Value,
    tags: string[],
    areTagsBeingManaged: boolean,
    background: string,
    autoSaveInterval: NodeJS.Timer
}


export class WikiEditPage extends React.Component<WikiEditPageProps, WikiEditPageState>{
    constructor(props: WikiEditPageProps) {
        super(props);
        this.state = {
            editorContent: Value.fromJSON(JSON.parse('{}')),
            tags: this.props.article.tags,
            areTagsBeingManaged: false,
            background: this.props.article.background,
            autoSaveInterval: undefined
        }

    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        if (appTitle.innerText !== this.props.selectedWiki.name) {
            appTitle.innerText = `${this.props.selectedWiki.name} - editing@${this.props.routeParams.article}`;
        }
        //@ts-ignore
        this.props.loadArticle(this.props.routeParams.article ? this.props.routeParams.article : 'home').then((article: Article) => {
            console.log('loaded article to edit');
            console.log(article);
            console.log(article.content);
            this.setState(() => ({
                editorContent: Value.fromJSON(article.content),
                tags: article.tags
            }));
        });
        const {shouldAutoSave} = this.props.appData;
        if(shouldAutoSave){
            let interval  = this.props.appData.autoSaveInterval;
            if(typeof interval !== 'number' || interval < 1){
                interval = 1;
            }
            this.setState(()=>({
                autoSaveInterval: setInterval(this.saveChanges,1000*60*interval)
            }));
        }


    }
    componentWillUnmount(){
        if(this.state.autoSaveInterval !== undefined){
            clearInterval(this.state.autoSaveInterval);
            this.setState(()=>({
                autoSaveInterval: null
            }));
        }
    }

    onChange = (change: { operations: any, value: Value }) => {
        const editorContent = change.value;
        this.setState(() => ({ editorContent }));
    }
    saveChanges = ()=>{
        console.log('Saved changes');
        return this.props.saveArticle({
            name: this.props.routeParams.article,
            tags: this.state.tags,
            content: this.state.editorContent.toJSON(),
            background: this.state.background,
            keywords: [] 
        })
    }
    saveChangesAndRedirect = () => {
        //@ts-ignore
        this.saveChanges().then(() => {
            this.props.history.pushState(`/wiki/article/${this.props.routeParams.article}`);
        }).catch((e: string) => console.warn(e));
    }
    discardChanges = () => {
        this.props.history.pushState('/wiki/article/home');
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
    getBackground = () => {
        let background = this.props.selectedWiki.background;
        if (this.props.article &&
            this.props.article.background ||
            this.state.background
        ) {
            background = this.state.background;
        }
        if (!background) {
            //set background to the default here;
        }
        return background;
    }
    onBackgroundChange = (newBackground: string) => {
        this.setState(() => ({
            background: newBackground
        }));
    }
    render() {
        const article = this.props.routeParams.article;
        return (
            <div className='wiki-route'>
                <img className='wiki-background' src={this.getBackground()} alt="" />
                <WikiHeader />
                <div className='body--article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                            <div className='wiki-article__actions'>
                                <button onClick={this.saveChangesAndRedirect}>
                                    <i className='material-icons'>check</i>
                                </button>
                                <button onClick={this.discardChanges}>
                                    <i className='material-icons'>clear</i>
                                </button>
                                <button onClick={this.toggleTagManagement}>
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
                    <div
                        className='wiki-article__body--editor'
                    >
                        <WikiEditor
                            onChange={this.onChange}
                            content={this.state.editorContent}
                            readOnly={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps: MapStateToProps<WikiEditPageReduxProps, WikiEditPageOwnProps, AppState> = (state, props) => {
    return {
        selectedWiki: state.selectedWiki,
        article: getArticle(props.routeParams.article, state.selectedWiki),
        appData: state.appData
    };
}



export default connect(mapStateToProps, (dispatch,props)=>{
    return{
        //@ts-ignore
        loadArticle:  (name: string)=>dispatch(loadArticle(name)),
        //@ts-ignore
        saveArticle:  (article: Article)=>dispatch(saveArticle(article))
    }

})(WikiEditPage);