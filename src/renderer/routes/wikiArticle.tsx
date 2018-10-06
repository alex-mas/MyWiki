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
    fsError: FsErrorActionCreator
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
        const fetchedContent = this.getArticleContent();
        this.state = {
            content: fetchedContent ? Value.fromJSON(fetchedContent) : defaultEditorContents,
            fileExists: fetchedContent ? true : false
        }
    }
    componentDidUpdate(prevProps: WikiArticlePageProps, prevState: any) {
        console.log('Previous:', prevProps, prevState);
        console.log('Actual: ', this.props, this.state);
        if (this.props.routeParams.article !== prevProps.routeParams.article) {
            const fetchedContent = this.getArticleContent();
            this.setState(() => ({
                content: fetchedContent ? Value.fromJSON(fetchedContent) : defaultEditorContents,
                fileExists: fetchedContent ? true : false
            }));
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
            }else{
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
                <h1>Article not found</h1>
                <MemoryLink to={`/wiki/create/${this.props.routeParams.article}`}> Create Article</MemoryLink>
                <MemoryLink to={`/wiki/article/home`}> Go home</MemoryLink>
            </div>
        )
    }

    render() {
        const article = this.props.routeParams.article;
        if (this.state.fileExists) {
            return (
                <div className='wiki-route'>
                    <div className='wiki-article__actions'>
                        <MemoryLink to={`/wiki/create`}> Create Article</MemoryLink>
                        {article !== 'home' ? <button onClick={this.deleteArticle}>Delete article</button> : null}
                        <MemoryLink to={`/wiki/edit/${article}`}> Edit Article</MemoryLink>
                    </div>
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
    fsError
})(WikiArticlePage);