import * as React from 'react';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { RouteProps } from '@axc/react-components/historyRouter';
import WikiEditor from '../wikiEditor/wikiEditor';
import { Value } from 'slate';
import { loadArticle, LoadArticleActionCreator, Article, saveArticle, SaveArticleActionCreator, ArticleMetaData } from '../../actions/article';
import TagForm from '../tagForm';
import { getArticle } from '../../selectors/articles';
import { ImageInput } from '../imageInput';
import WikiHeader from '../wikiHeader';
import { WikiMetadata } from '../../store/reducers/wikis';
import { AppData } from '../../store/reducers/appData';
import WikiView from '../wikiView';
import { getSelectedWiki } from '../../selectors/wikis';
import { RouteComponentProps } from 'react-router';



interface DispatchProps {
    loadArticle: LoadArticleActionCreator,
    saveArticle: SaveArticleActionCreator
}

interface OwnProps extends RouteComponentProps<{article:string}>{
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
    background: string,
    autoSaveInterval: NodeJS.Timer
}


export class WikiEditPage extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
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
        //@ts-ignore
        this.props.loadArticle(this.props.match.params.article ? this.props.match.params.article : 'home').then((article: Article) => {
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
            background: this.state.background,
            keywords: []
        });
    }
    saveChangesAndRedirect = () => {
        //@ts-ignore
        this.saveChanges().then(() => {
            console.log("finished saving, pushing state");
            //workarround to prevent loading article to fail immediatly after navigation
            setTimeout(()=>this.props.history.push(`/wiki/article/${this.props.match.params.article}`),50);  
        }).catch((e: string) => console.warn(e));
    }
    discardChanges = () => {
        this.props.history.push('/wiki/article/home');
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
        const article = this.props.match.params.article;
        return (
            <WikiView 
            background={this.getBackground()}
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
                                <ImageInput
                                    prompt='Choose Background'
                                    onChange={this.onBackgroundChange}
                                    windowTitle='choose a background for the article'
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

            </WikiView>
        );
    }
}







export default connect(
    (state: AppState, props: OwnProps) => {
        const selectedWiki = getSelectedWiki(state);
        return {
            selectedWiki,
            article: getArticle(props.match.params.article, selectedWiki),
            appData: state.appData
        }
    },
    (dispatch, props) => {
        return {
            //@ts-ignore
            loadArticle: (name: string) => dispatch(loadArticle(name)),
            //@ts-ignore
            saveArticle: (article: Article) => dispatch(saveArticle(article))
        }

    }
)(WikiEditPage);