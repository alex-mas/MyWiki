import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import * as ReactMarkdown from 'react-markdown';
import { Change, Value } from 'slate';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import Header from '../components/header';
import { loadArticle, LoadArticleActionCreator, Article, DeleteArticleActionCreator, deleteArticle } from '../actions/article';
import WikiSearchBar from '../components/wikiSearchBar';
import { getArticle } from '../selectors/articles';
import { WikiMetaData } from '../store/reducers/wikis';
import { SelectedWiki } from '../store/reducers/selectedWiki';





export interface DispatchProps {
    fsError: FsErrorActionCreator,
    loadArticle: LoadArticleActionCreator,
    deleteArticle: DeleteArticleActionCreator
}

export interface WikiArticlePageOwnProps extends MemoryRouteProps {
}

export interface WikiArticlePageReduxProps {
    selectedWiki: SelectedWiki,
    article: Article
}


export interface WikiArticlePageProps extends MemoryRouteProps, WikiArticlePageReduxProps, DispatchProps {
}

//  <ReactMarkdown source={fs.readFileSync(path.join(props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiArticlePage extends React.Component<WikiArticlePageProps, any>{
    constructor(props: WikiArticlePageProps) {
        super(props);
        this.state = {
            content: Value.fromJSON(JSON.parse('{}'))
        }
    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        if (appTitle.innerText !== this.props.selectedWiki.name) {
            appTitle.innerText = `${this.props.selectedWiki.name}@${this.props.routeParams.article}`;
        }
        //@ts-ignore
        this.props.loadArticle(this.props.routeParams.article).then((article: Article) => {
            console.log('Article returned from load article: ', article);
            this.setState(() => ({
                content: article.content ? Value.fromJSON(JSON.parse(article.content)) : defaultEditorContents,
                fileExists: article.content ? true : false
            }));
        }).catch((e: string) => {
            console.log(e);
            this.setState(() => ({
                fileExists: false
            }));
        })
    }
    componentDidUpdate(prevProps: WikiArticlePageProps, prevState: any) {
        console.log('Previous:', prevProps, prevState);
        console.log('Actual: ', this.props, this.state);
        if (this.props.routeParams.article !== prevProps.routeParams.article) {
            //@ts-ignore
            this.props.loadArticle(this.props.routeParams.article).then((article: Article) => {
                this.setState(() => ({
                    content: article.content ? Value.fromJSON(JSON.parse(article.content)) : defaultEditorContents,
                    fileExists: article.content ? true : false
                }));
            }).catch(() => {
                this.setState(() => ({
                    fileExists: false
                }));
            })

        }
    }
    deleteArticle = () => {
        //@ts-ignore
        this.props.deleteArticle(this.props.routeParams.article).then(() => {
            this.props.history.pushState('/wiki/article/home');
        });
    }
    onChange = (change: Change) => {
        const content = change.value;
        this.setState(() => ({ content }));
    }
    renderArticleNotFound = () => {
        return (
            <div className='wiki-route'>
                <img className='wiki-background' src={this.getBackground()} alt="" />
                <Header>
                    <i className='wiki-header__icon'>placeholder</i>
                    <MemoryLink to={`/wiki/create/${this.props.routeParams.article}`}> Create Article</MemoryLink>
                </Header>
                <h1>Article not found</h1>
            </div>
        )
    }
    getBackground = () => {
        let background = this.props.selectedWiki.background;
        if (this.props.article && this.props.article.background) {
            background = this.props.article.background;
        } else if (!background) {
            //set background to the default here;
        }
        return background;
    }
    render() {
        const article = this.props.routeParams.article;
        if (this.state.fileExists) {
            return (
                <div className='wiki-route'>
                    <img className='wiki-background' src={this.getBackground()} alt="" />
                    <Header>
                        <i className='wiki-header__icon'>placeholder</i>
                        <WikiSearchBar />
                        <div className='wiki-article__actions'>
                            <MemoryLink to={`/wiki/create/`}> Create Article</MemoryLink>
                            {article !== 'home' ? <button onClick={this.deleteArticle}>Delete article</button> : null}
                            <MemoryLink to={`/wiki/edit/${article}`}> Edit Article</MemoryLink>
                        </div>
                    </Header>
                    <div className='body--article'>
                        <h1 className='wiki-article__title'>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                        <div
                            className='wiki-article__body'
                        >
                            <WikiEditor
                                content={this.state.content}
                                onChange={this.onChange}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return this.renderArticleNotFound();
        }

    }
}


const mapStateToProps: MapStateToProps<WikiArticlePageReduxProps, WikiArticlePageOwnProps, AppState> = (state, props) => {
    return {
        selectedWiki: state.selectedWiki,
        article: getArticle(props.routeParams.article, state.selectedWiki)
    };
}


export default connect(mapStateToProps, {
    fsError,
    loadArticle,
    deleteArticle
})(WikiArticlePage);