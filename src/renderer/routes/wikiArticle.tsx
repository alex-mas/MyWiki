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


export interface DispatchProps {
    fsError: FsErrorActionCreator
}

export interface WikiArticlePageOwnProps extends MemoryRouteProps {
}

export type WikiArticlePageReduxProps = Pick<AppState, 'selectedWiki'>

export interface WikiArticlePageProps extends MemoryRouteProps, WikiArticlePageReduxProps, DispatchProps {
}

//  <ReactMarkdown source={fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiArticlePage extends React.Component<WikiArticlePageProps, any>{
    constructor(props: WikiArticlePageProps) {
        super(props);
        debugger;
        const fetchedContent = this.getArticleContent();
        this.state = {
            content: fetchedContent ? Value.fromJSON(fetchedContent) : defaultEditorContents,
            fileExists: fetchedContent ? true : false
        }
    }
    static getDerivedStateFromProps = (props: WikiArticlePageProps,state:any)=>{
        const fetchedContent = this.getArticleContent();
        return{

        }
    }
    getArticleContent = () => {
        let content;
        let filePath;
        try {
            console.log('Before fetching file: ', this.props);
            if (this.props.routeParams && this.props.routeParams.article) {
                filePath = path.join(this.props.selectedWiki.path,'articles', `${this.props.routeParams.article}.json`);
                content = fs.readFileSync(filePath, 'utf8');
            } else {
                filePath = path.join(this.props.selectedWiki.path,'articles', 'home.json');
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
        if (content) {
            return JSON.parse(content);
        }
    }
    onChange = (change: Change) => {
        const content = change.value;
        this.setState(() => ({ content }));
    }
    renderArticleNotFound = () => {
        return (
            <div>
                <h1>Article not found</h1>
                <MemoryLink to={`/wiki/create`}> Create Article</MemoryLink>
                <MemoryLink to={`/wiki/article/home`}> Go home</MemoryLink>
            </div>
        )
    }
    render() {
        const article = this.props.routeParams.article;
        console.log(this.state);
        if (this.state.fileExists) {
            return (
                <div>
                    <div>
                        <MemoryLink to={`/wiki/create`}> Create Article</MemoryLink>
                        <button>Delete article</button>
                        <MemoryLink to={`/wiki/edit/${article}`}> Edit Article</MemoryLink>
                    </div>
                    <h1>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                    <div style={{ padding: '5rem' }}>
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