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



export interface WikiEditPageDispatchProps {
    fsError: FsErrorActionCreator,
    loadArticle: LoadArticleActionCreator,
    saveArticle: SaveArticleActionCreator
}

export interface WikiEditPageOwnProps extends MemoryRouteProps {
}

export type WikiEditPageReduxProps = Pick<AppState, 'selectedWiki'>

export interface WikiEditPageProps extends WikiEditPageOwnProps, WikiEditPageReduxProps, WikiEditPageDispatchProps {
}


export class WikiEditPage extends React.Component<WikiEditPageProps, any>{
    constructor(props: WikiEditPageProps) {
        super(props);
        this.state = {
            editorContent: Value.fromJSON(JSON.parse('{}')),
            tags: []
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
                editorContent: Value.fromJSON(JSON.parse(article.content))
            }));
        });
    }
    getArticleContent = () => {
        let content;
        let filePath;
        try {
            console.log('Before fetching file: ', this.props);
            if (this.props.routeParams && this.props.routeParams.article) {
                filePath = path.join(this.props.selectedWiki.path, 'articles', `${this.props.routeParams.article}.json`);
                content = fs.readFileSync(filePath, 'utf8');
            } else {
                filePath = path.join(this.props.selectedWiki.path, 'articles', 'home.json');
                content = fs.readFileSync(filePath, 'utf8');
            }
        } catch (e) {
            fs.access(filePath, (error) => {
                if (error) {
                    this.props.fsError(`Error trying to fetch article ${this.props.routeParams.article}, please try running the app as administrator. If that doesn't work contact the developer`);
                    console.warn(e);
                }
            });
        }
        if (content) { return JSON.parse(content); }
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
    render() {
        const article = this.props.routeParams.article;
        return (
            <div className='wiki-route'>
                <Header>
                    <div className='wiki-article__actions'>
                        <button onClick={this.saveChanges}>Save changes</button>
                        <button onClick={this.discardChanges}>Discard changes</button>
                    </div>
                </Header>
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
        selectedWiki: state.selectedWiki
    };
}



export default connect(mapStateToProps, {
    fsError,
    loadArticle,
    saveArticle
})(WikiEditPage);