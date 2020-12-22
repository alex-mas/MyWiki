import * as React from 'react';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { RouteProps } from '@axc/react-components/historyRouter';
import WikiEditor from '../wikiEditor/wikiEditor';
import { Value } from 'slate';
import { loadArticle, LoadArticleActionCreator, Article, saveArticle, SaveArticleActionCreator, ArticleMetaData, ArticleCategory } from '../../actions/article';
import TagForm from '../tagForm';
import { getArticle } from '../../selectors/articles';
import { ImageInput } from '../imageInput';
import WikiHeader from '../wikiHeader';
import { WikiMetadata } from '../../store/reducers/wikis';
import { AppData } from '../../store/reducers/appData';
import WikiView from '../wikiView';
import { getSelectedWiki, getWikiById } from '../../selectors/wikis';
import { RouteComponentProps } from 'react-router';



interface DispatchProps {
    loadArticle: LoadArticleActionCreator,
    saveArticle: SaveArticleActionCreator
}

interface OwnProps extends RouteComponentProps<{ article: string, id: string }> {
}

interface ReduxProps {
    selectedWiki: WikiMetadata,
    article: ArticleMetaData,
    appData: AppData
}


type ComponentProps = OwnProps & ReduxProps & DispatchProps;

interface ComponentState {
    editorContent: Value,
    tags: string[],
    areTagsBeingManaged: boolean,
    autoSaveInterval: NodeJS.Timer
}


export class WikiEditPage extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            editorContent: Value.fromJSON(JSON.parse('{}')),
            tags: this.props.article.tags,
            areTagsBeingManaged: false,
            autoSaveInterval: undefined
        }

    }
    componentDidMount() {
        //@ts-ignore
        this.props.loadArticle(this.props.selectedWiki, this.props.match.params.article ? this.props.match.params.article : 'home',this.props.article.category).then((article: Article) => {
            console.log('loaded article to edit');
            console.log(article);
            console.log(article.content);
            this.setState(() => ({
                editorContent: Value.fromJSON(article.content),
                tags: article.tags
            }));
        });
        const { shouldAutoSave } = this.props.appData;
        if (shouldAutoSave) {
            let interval = this.props.appData.autoSaveInterval;
            if (typeof interval !== 'number' || interval < 1) {
                interval = 1;
            }
            this.setState(() => ({
                autoSaveInterval: setInterval(this.saveChanges, 1000 * 60 * interval)
            }));
        }


    }
    componentWillUnmount() {
        if (this.state.autoSaveInterval !== undefined) {
            clearInterval(this.state.autoSaveInterval);
            this.setState(() => ({
                autoSaveInterval: null
            }));
        }
    }

    onChange = (change: { operations: any, value: Value }) => {
        console.log("about to chage editor's value", change);
        const editorContent = change.value;
        this.setState(() => ({ editorContent }));
    }
    saveChanges = () => {
        console.log('About to save changes');
        return this.props.saveArticle({
            name: this.props.match.params.article,
            tags: this.state.tags,
            content: this.state.editorContent.toJSON(),
            keywords: [],
            lastEdited: Date.now(),
            lastRead: this.props.article.lastRead,
            category: this.props.article.category,
            groups: []
        }, this.props.selectedWiki);
    }
    saveChangesAndRedirect = () => {
        //@ts-ignore
        this.saveChanges().then(() => {
            console.log("finished saving, pushing state");
            //workarround to prevent loading article to fail immediatly after navigation
            setTimeout(() => this.props.history.push(`/wiki/${this.props.match.params.id}`), 50);
        }).catch((e: string) => console.warn(e));
    }
    discardChanges = () => {
        this.props.history.push(`/wiki/${this.props.match.params.id}`);
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

    render() {
        const article = this.props.match.params.article;
        return (
            <WikiView
                title={`${this.props.selectedWiki.name} - editing@${this.props.match.params.article}`}
            >
                <div className='wiki-article'>
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

            </WikiView>
        );
    }
}







export default connect(
    (state: AppState, props: OwnProps) => {
        const selectedWiki = getWikiById(state, props.match.params.id);
        return {
            selectedWiki,
            article: getArticle(props.match.params.article, selectedWiki),
            appData: state.appData
        }
    },
    {
        loadArticle,
        saveArticle
    } as DispatchProps
//@ts-ignore    
)(WikiEditPage);