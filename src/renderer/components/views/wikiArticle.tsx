import I18String from '@axc/react-components/i18string';
import { withPrompt } from '@axc/react-components/prompt';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Value } from 'slate';
import { Article, ArticleMetaData, deleteArticle, DeleteArticleActionCreator, loadArticle, LoadArticleActionCreator, saveArticle, SaveArticleActionCreator } from '../../actions/article';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import { getArticle } from '../../selectors/articles';
import { getWikiById } from '../../selectors/wikis';
import { WikiMetadata } from '../../store/reducers/wikis';
import { AppState } from '../../store/store';
import { DeletePrompt, DeletePromptFunction } from '../deletePrompt';
import defaultEditorContents from '../wikiEditor/utilities/defaultValue';
import WikiEditor from '../wikiEditor/wikiEditor';
import WikiSearchBar from '../wikiSearchBar';
import WikiView from '../wikiView';
const { dialog } = require('electron').remote



interface DispatchProps {
  fsError: FsErrorActionCreator,
  loadArticle: LoadArticleActionCreator,
  saveArticle: SaveArticleActionCreator,
  deleteArticle: DeleteArticleActionCreator
}

interface PromptProps {
  prompt: DeletePromptFunction;
}
interface OwnProps extends RouteComponentProps<{ article: string, id: string }> {
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
      content: Value.fromJSON(JSON.parse('{}')),
      fileExists: true
    }
  }
  componentDidMount() {
    //@ts-ignore
    this.props.loadArticle(this.props.selectedWiki, this.props.match.params.article, this.props.article.category).then((article: Article) => {
      this.setState(() => ({
        content: article.content ? Value.fromJSON(article.content) : defaultEditorContents,
        fileExists: article.content ? true : false
      }));
      console.log('saving article with updated read time');
      this.props.saveArticle({
        ...article,
        lastRead: Date.now()
      }, this.props.selectedWiki);
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
      this.props.loadArticle(this.props.selectedWiki, this.props.match.params.article).then((article: Article) => {
        this.setState(() => ({
          content: article.content ? Value.fromJSON(article.content) : defaultEditorContents,
          fileExists: article.content ? true : false
        }));
        console.log('saving article with updated read time');
        this.props.saveArticle({
          ...article,
          lastRead: Date.now()
        }, this.props.selectedWiki);
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
        this.props.deleteArticle(this.props.match.params.article, this.props.selectedWiki).then(() => {
          this.props.history.push(`/wiki/${this.props.match.params.id}`);
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
        title={`${this.props.selectedWiki.name}@${this.props.match.params.article}`}
      >
        <div className='wiki-article'>
          <div className='wiki-article__header'>
            <div className='wiki-article__header__section'>
              <h1 className='wiki-article__title'> <I18String text='article not found' format='capitalizeFirst' /></h1>
              <div className='wiki-article__actions'>
                <Link to={`/wiki/${this.props.match.params.id}/create/${this.props.match.params.article}`}><i className="material-icons">add</i></Link>
              </div>
            </div>
          </div>
        </div>
      </WikiView>
    )
  }

  render() {
    const article = this.props.match.params.article;
    if (this.state.fileExists) {
      return (
        <WikiView
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
                  <Link to={`/wiki/${this.props.match.params.id}/edit/${article}`}><i className='material-icons'>create</i></Link>
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




//@ts-ignore
export default withPrompt<PageProps>(connect(
  (state: AppState, props: OwnProps) => {
    const selectedWiki = getWikiById(state, props.match.params.id);
    return {
      selectedWiki,
      article: getArticle(props.match.params.article, selectedWiki)
    };
  },
  {
    fsError,
    loadArticle,
    deleteArticle,
    saveArticle
  }
  //@ts-ignore
)(WikiArticlePage));