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
import { loadArticle, LoadArticleActionCreator, Article } from '../actions/article';


const getArticleContent = (props: any) => {
    let content;
    let filePath;
    try {
        if (props.routeParams && props.routeParams.article) {
            filePath = path.join(props.selectedWiki.path, 'articles', `${props.routeParams.article}.json`);
            content = fs.readFileSync(filePath, 'utf8');
        } else {
            filePath = path.join(props.selectedWiki.path, 'articles', 'home.json');
            content = fs.readFileSync(filePath, 'utf8');
        }
    } catch (e) {
        fs.access(filePath, (error) => {
            if (error) {
                props.fsError(`Error trying to fetch article ${props.routeParams.article}, please try running the app as administrator. If that doesn't work contact the developer`);
                console.warn(e);
            }
        });
    }
    if (content) {
        return JSON.parse(content);
    }
}


export interface DispatchProps {
    fsError: FsErrorActionCreator,
    loadArticle: LoadArticleActionCreator
}

export interface WikiArticlePageOwnProps extends MemoryRouteProps {
}

export type WikiArticlePageReduxProps = Pick<AppState, 'selectedWiki'>

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
            console.log('Article returned from load article: ',article);
            this.setState(() => ({
                content: article.content ? Value.fromJSON(JSON.parse(article.content)) : defaultEditorContents,
                fileExists: article.content ? true : false
            }));
        }).catch((e:string) => {
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

    getArticleContent = () => {
        let content;
        let filePath;
        try {
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
                    console.warn(e, error);
                }
            });
        }
        if (content) {
            return JSON.parse(content);
        }
    }
    deleteArticle = () => {
        let filePath = path.join(this.props.selectedWiki.path, 'articles', `${this.props.routeParams.article}.json`);
        fs.unlink(filePath, (error) => {
            if (error) {
                this.props.fsError(`Error trying to delete article ${this.props.routeParams.article}, please try running the app as administrator. If that doesn't work contact the developer`);
                console.warn(error);
            } else {
                this.props.history.pushState('/wiki/article/home');
            }

        });
    }
    onChange = (change: Change) => {
        const content = change.value;
        this.setState(() => ({ content }));
    }
    renderArticleNotFound = () => {
        return (
            <div className='wiki-route'>
                <Header>
                    <i className='wiki-header__icon'>placeholder</i>
                    <MemoryLink to={`/wiki/create/${this.props.routeParams.article}`}> Create Article</MemoryLink>
                </Header>
                <h1>Article not found</h1>

            </div>
        )
    }

    render() {
        const article = this.props.routeParams.article;
        if (this.state.fileExists) {
            return (
                <div className='wiki-route'>
                    <Header>
                        <i className='wiki-header__icon'>placeholder</i>
                        <input type="text" placeholder='search' />
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
        selectedWiki: state.selectedWiki
    };
}


export default connect(mapStateToProps, {
    fsError,
    loadArticle
})(WikiArticlePage);