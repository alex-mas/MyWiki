import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import * as ReactMarkdown from 'react-markdown';
import { ValueJSON, Change, Value } from 'slate';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import Header from '../components/header';
import { loadArticle, LoadArticleAction, LoadArticleActionCreator, Article, saveArticle, SaveArticleActionCreator } from '../actions/article';
import TagForm from '../components/tagForm';
import { getArticle } from '../selectors/articles';
import { SelectedWiki } from '../store/reducers/selectedWiki';



export interface WikiEditPageDispatchProps {
    fsError: FsErrorActionCreator,
    loadArticle: LoadArticleActionCreator,
    saveArticle: SaveArticleActionCreator
}

export interface WikiEditPageOwnProps extends MemoryRouteProps {
}

export interface WikiEditPageReduxProps {
    selectedWiki: SelectedWiki,
    article: Article
}


export interface WikiEditPageProps extends WikiEditPageOwnProps, WikiEditPageReduxProps, WikiEditPageDispatchProps {
}

export interface WikiEditPageState {
    editorContent: Value, 
    tags: string[],
    areTagsBeingManaged: boolean,
    background: string
}


export class WikiEditPage extends React.Component<WikiEditPageProps, WikiEditPageState>{
    constructor(props: WikiEditPageProps) {
        super(props);
        this.state = {
            editorContent: Value.fromJSON(JSON.parse('{}')),
            tags: [],
            areTagsBeingManaged: false,
            background: this.props.article.background
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
            console.log(JSON.parse(article.content));
            this.setState(() => ({
                editorContent: Value.fromJSON(JSON.parse(article.content)),
                tags: article.tags
            }));
        });
    }

    onChange = (change: Change) => {
        const editorContent = change.value;
        this.setState(() => ({ editorContent }));
    }
    saveChanges = () => {
        //@ts-ignore
        this.props.saveArticle(this.props.routeParams.article,this.state.tags, JSON.stringify(this.state.editorContent.toJSON())).then(()=>{
            this.props.history.pushState(`/wiki/article/${this.props.routeParams.article}`);
        }).catch((e:string)=>console.warn(e));
    }
    discardChanges = () => {
        this.props.history.pushState('/wiki/article/home');
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
    getBackground = ()=>{
        let background = this.props.selectedWiki.background;
        if(!background){
            const article = this.props.selectedWiki.articles.find((currentArticle)=>currentArticle.name === this.props.routeParams.article);
            if(article && article.background){
                background = article.background;
            }else{
                //set background to the default here;
            }
        }
        return background;
    }
    render() {
        const article = this.props.routeParams.article;
        return (
            <div className='wiki-route'>
            <img className='wiki-route__background-image' src={this.getBackground()} alt=""/>
                <Header>
                    <div className='wiki-article__actions'>
                        <button onClick={this.saveChanges}>Save changes</button>
                        <button onClick={this.discardChanges}>Discard changes</button>
                        <button onClick={this.toggleTagManagement}>Manage tags</button>
                    </div>
                </Header>
                <TagForm
                    toggled={this.state.areTagsBeingManaged}
                    tags={this.state.tags}
                    onChange={this.onChangeTags}
                />
                <div className='body--article'>
                    <h1 className='wiki-article__title'>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
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
        article: getArticle(props.routeParams.article, state.selectedWiki)
    };
}



export default connect(mapStateToProps, {
    fsError,
    loadArticle,
    saveArticle
})(WikiEditPage);