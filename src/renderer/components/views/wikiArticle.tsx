import * as React from 'react';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Link } from 'react-router-dom';
import WikiEditor from '../wikiEditor/wikiEditor';
import defaultEditorContents from '../wikiEditor/utilities/defaultValue';
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
import I18String from '@axc/react-components/i18string';
import WikiView from '../wikiView';
import { withPrompt, PromptFunction } from '@axc/react-components/prompt';
import { DeletePromptFunction, DeletePrompt } from '../deletePrompt';
import { getSelectedWiki } from '../../selectors/wikis';
import { RouteComponentProps } from 'react-router';
const { dialog } = require('electron').remote



interface DispatchProps {
    fsError: FsErrorActionCreator,
    loadArticle: LoadArticleActionCreator,
    deleteArticle: DeleteArticleActionCreator
}

interface PromptProps {
    prompt: DeletePromptFunction;
}
interface OwnProps extends RouteComponentProps<{ article: string }> {
}

interface ReduxProps {
    selectedWiki: WikiMetadata,
    article: ArticleMetaData
}


type PageProps = OwnProps & ReduxProps & DispatchProps & PromptProps;

//  <ReactMarkdown source={fs.readFileSync(path.join(props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiArticlePage extends React.Component<PageProps, any>{
    constructor(props: PageProps) {
        super(props);
        this.state = {
            content: Value.fromJSON(JSON.parse('{}'))
        }
    }
    componentDidMount() {
        //@ts-ignore
        this.props.loadArticle(this.props.match.params.article).then((article: Article) => {
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
        if (this.props.match.params.article !== prevProps.match.params.article) {
            //@ts-ignore
            this.props.loadArticle(this.props.match.params.article).then((article: Article) => {
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
        this.props.prompt(DeletePrompt, { title: 'are you sure you want to delete this article?' }).then((response) => {
            if (response) {
                //@ts-ignore
                this.props.deleteArticle(this.props.match.params.article).then(() => {
                    this.props.history.push('/wiki/article/home');
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
            <WikiView
                background={this.getBackground()}
                title={`${this.props.selectedWiki.name}@${this.props.match.params.article}`}
            >
                <div className='wiki-article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'> <I18String text='article not found' format='capitalizeFirst' /></h1>
                            <div className='wiki-article__actions'>
                                <Link to={`/wiki/create/${this.props.match.params.article}`}><i className="material-icons">add</i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </WikiView>
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
        const article = this.props.match.params.article;
        if (this.state.fileExists) {
            return (
                <WikiView
                    background={this.getBackground()}
                    title={`${this.props.selectedWiki.name}@${this.props.match.params.article}`}
                >
                    <div className='wiki-article'>


                        <div className='wiki-article__header'>
                            <div className='wiki-article__searchbar'>
                                <WikiSearchBar />
                            </div>
                            <div className='wiki-article__header__section'>
                                <h1 className='wiki-article__title'>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                                <div className='wiki-article__actions'>
                                    {article !== 'home' ? <button onClick={this.deleteArticle}><i className='material-icons'>delete_forever</i></button> : null}
                                    <Link to={`/wiki/edit/${article}`}><i className='material-icons'>create</i></Link>
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





export default withPrompt<PageProps>(connect(
    (state: AppState, props: OwnProps) => {
        const selectedWiki = getSelectedWiki(state);
        return {
            selectedWiki,
            article: getArticle(props.match.params.article, selectedWiki)
        };
    },
    {
        fsError,
        loadArticle,
        deleteArticle
    }
    //@ts-ignore
)(WikiArticlePage));