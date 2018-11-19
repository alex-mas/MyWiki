import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../../router/router';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import WikiEditor, { defaultEditorContents } from '../wikiEditor/wikiEditor';
import * as ReactMarkdown from 'react-markdown';
import { Value } from 'slate';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import Header from '../header';
import { loadArticle, LoadArticleActionCreator, Article, DeleteArticleActionCreator, deleteArticle, ArticleMetaData } from '../../actions/article';
import WikiSearchBar from '../wikiSearchBar';
import { getArticle } from '../../selectors/articles';
import { WikiMetadata } from '../../store/reducers/wikis';
import WikiHeader from '../wikiHeader';
import HomeButton from '../homeButton';
import I18String from '@axc/react-components/display/i18string';
import WikiView from '../wikiView';
import { withPrompt, PromptFunction } from '@axc/react-components/interactive/prompt';
import { DeletePromptFunction, DeletePrompt } from '../deletePrompt';
const { dialog } = require('electron').remote



export interface DispatchProps {
    fsError: FsErrorActionCreator,
    loadArticle: LoadArticleActionCreator,
    deleteArticle: DeleteArticleActionCreator
}

export interface PromptProps {
    prompt: DeletePromptFunction;
}
export interface OwnProps extends MemoryRouteProps {
}

export interface ReduxProps {
    selectedWiki: WikiMetadata,
    article: ArticleMetaData
}


export type PageProps = MemoryRouteProps & ReduxProps & DispatchProps & PromptProps;

//  <ReactMarkdown source={fs.readFileSync(path.join(props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiArticlePage extends React.Component<PageProps, any>{
    constructor(props: PageProps) {
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
            this.setState(() => ({
                content: article.content ? Value.fromJSON(article.content) : defaultEditorContents,
                fileExists: article.content ? true : false
            }));
        }).catch((e: string) => {
            console.log(e);
            this.setState(() => ({
                fileExists: false
            }));
        })
    }
    componentDidUpdate(prevProps: PageProps, prevState: any) {
        if (this.props.routeParams.article !== prevProps.routeParams.article) {
            //@ts-ignore
            this.props.loadArticle(this.props.routeParams.article).then((article: Article) => {
                this.setState(() => ({
                    content: article.content ? Value.fromJSON(article.content) : defaultEditorContents,
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
        this.props.prompt(DeletePrompt, {title: 'are you sure you want to delete this article?'}).then((response) => {
            if (response) {
                //@ts-ignore
                this.props.deleteArticle(this.props.routeParams.article).then(() => {
                    this.props.history.pushState('/wiki/article/home');
                });
            }
        });
    }
    onChange = (change: { operations: any, value: Value }) => {
        const content = change.value;
        this.setState(() => ({ content }));
    }
    renderArticleNotFound = () => {
        return (
            <div className='wiki-route'>
                <img className='wiki-background' src={this.getBackground()} alt="" />
                <WikiHeader />
                <div className='body--article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'> <I18String text='article not found' format='capitalizeFirst' /></h1>
                            <div className='wiki-article__actions'>
                                <MemoryLink to={`/wiki/create/${this.props.routeParams.article}`}><i className="material-icons">add</i></MemoryLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className='wiki-article__body'
                >
                </div>

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
                <WikiView background={this.getBackground()}>
                    <div className='body--article'>
                        <div className='wiki-article__header'>
                            <div className='wiki-article__header__section'>
                                <h1 className='wiki-article__title'>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                                <div className='wiki-article__actions'>
                                    {article !== 'home' ? <button onClick={this.deleteArticle}><i className='material-icons'>delete_forever</i></button> : null}
                                    <MemoryLink to={`/wiki/edit/${article}`}><i className='material-icons'>create</i></MemoryLink>
                                </div>
                            </div>
                        </div>
                        <div className='wiki-article__body'>
                            <WikiEditor
                                content={this.state.content}
                                onChange={this.onChange}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </WikiView>
            )
        } else {
            return this.renderArticleNotFound();
        }

    }
}


const mapStateToProps: MapStateToProps<ReduxProps, OwnProps, AppState> = (state, props) => {
    return {
        selectedWiki: state.selectedWiki,
        article: getArticle(props.routeParams.article, state.selectedWiki)
    };
}


export default withPrompt<any>(connect(mapStateToProps, {
    fsError,
    loadArticle,
    deleteArticle
})(WikiArticlePage));