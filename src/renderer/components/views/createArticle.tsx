import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { RouteProps } from '../../router';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata } from '../../store/reducers/wikis';
import WikiEditor from '../wikiEditor/wikiEditor';
import defaultEditorContents from '../wikiEditor/utilities/defaultValue';
import { RouteComponentProps } from 'react-router-dom';
import { Value } from 'slate';
import { CreateArticleActionCreator, createArticle, Article } from '../../actions/article';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import Header from '../header';
import TagForm from '../tagForm';
import { ImageInput } from '../imageInput';
import WikiHeader from '../wikiHeader';
import I18String from '@axc/react-components/i18string';
import WikiView from '../wikiView';
import { getSelectedWiki, getWikiById } from '../../selectors/wikis';
import DynamicTextInput from '../dynamicTextInput';


interface DispatchProps {
    createArticle: typeof createArticle,
    fsError: typeof fsError
}

interface ReduxProps {
    selectedWiki: WikiMetadata
}

interface OwnProps extends RouteComponentProps<{article:string, id:string}>{
}

type ComponentProps = OwnProps & DispatchProps & ReduxProps;


interface CreateArticlePageState {
    editorContent: Value,
    name: string,
    tags: string[],
    areTagsBeingManaged: boolean
}

export class CreateArticlePage extends React.Component<ComponentProps, CreateArticlePageState>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            editorContent: defaultEditorContents,
            name: this.props.match.params.article,
            tags: [],
            areTagsBeingManaged: false
        }
    }
    onChange = (change: { operations: any, value: Value }) => {
        const editorContent = change.value;
        this.setState(() => ({ editorContent }));
    }
    onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        this.setState(() => ({
            name
        }));
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
    createArticle = () => {
        this.props.createArticle({
            name: this.state.name || "defaultArticleName",
            content: this.state.editorContent.toJSON(),
            tags: this.state.tags,
            keywords: [],
            lastEdited: Date.now(),
            lastRead: Date.now(),
            category: '',
            groups: []
            //@ts-ignore
        }, this.props.selectedWiki).then(() => {
            console.log('created article');
            setTimeout(()=>this.props.history.push(`/wiki/${this.props.match.params.id}/article/${this.state.name}`),50);  
        });
    }
    discardChanges = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <WikiView 
                title={`${this.props.selectedWiki.name} - Create article ${this.state.name ? '(' + this.state.name + ')' : ''}`}
            >
                <div className='wiki-article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'>
                                <I18String text='creating' format='capitalizeFirst' />:
                                    {this.props.match.params.article ?
                                        this.state.name
                                        :
                                        <DynamicTextInput
                                            defaultWidth={50}
                                            className='wiki-article__header-input'
                                            value={this.state.name}
                                            onChange={this.onNameChange}
                                            placeholder='Article Name'
                                        />
                                    }

                            </h1>
                            <div className='wiki-article__actions'>
                                <button onClick={this.createArticle}>
                                    <i className='material-icons'>check</i>
                                </button>
                                <button onClick={this.discardChanges}>
                                    <i className='material-icons'>clear</i>
                                </button>
                                <button
                                    onClick={this.toggleTagManagement}
                                >
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

                    <div className='wiki-article__body--editor'>
                        <WikiEditor
                            content={this.state.editorContent}
                            onChange={this.onChange}
                            readOnly={false}
                        />
                    </div>

                </div>

            </WikiView>

        )
    }
}



export default connect(
    (state: AppState, props: OwnProps) => {
        return {
            selectedWiki: getWikiById(state, props.match.params.id) 
        }
    },
    {
        fsError,
        createArticle
    }
    //@ts-ignore
)(CreateArticlePage);


