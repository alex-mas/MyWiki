import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import * as ReactMarkdown from 'react-markdown';
import { ValueJSON, Change, Value } from 'slate';
import { fsError, FsErrorActionCreator } from '../actions/errors';



export interface WikiEditPageDispatchProps {
    fsError: FsErrorActionCreator
}

export interface WikiEditPageOwnProps extends MemoryRouteProps {
}

export type WikiEditPageReduxProps = Pick<AppState, 'selectedWiki'>

export interface WikiEditPageProps extends WikiEditPageOwnProps, WikiEditPageReduxProps, WikiEditPageDispatchProps {
}

//  <ReactMarkdown source={fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiEditPage extends React.Component<WikiEditPageProps, any>{
    constructor(props: WikiEditPageProps) {
        super(props);
        const fetchedContent = this.getArticleContent();
        this.state = {
            editorContent: fetchedContent ? Value.fromJSON(fetchedContent) : defaultEditorContents
        }
    }
    getArticleContent = () => {
        let content;
        let filePath;
        try {
            console.log('Before fetching file: ', this.props);
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
                    console.warn(e);
                }
            });
        }
        if (content) { return JSON.parse(content); }
    }

    onChange = (change: Change) => {
        const editorContent = change.value;
        this.setState(() => ({ editorContent }));
    }
    saveChanges = () => {
        fs.writeFile(
            path.join(this.props.selectedWiki.path, 'articles', `${this.props.routeParams.article}.json`),
            JSON.stringify(this.state.editorContent.toJSON()),
            'utf8',
            (err) => {
                if (err) {
                    console.warn(err);
                    this.props.fsError(`Error trying to edit article ${this.props.routeParams.article}, please try running the app as administrator. If that doesn't work contact the developer`);
                } else {
                    this.props.history.pushState(`/wiki/article/${this.props.routeParams.article}`);
                }
            }

        );
    }
    discardChanges = () => {
        this.props.history.pushState('/wiki/article/home');
    }
    render() {
        const article = this.props.routeParams.article;
        return (
            <div className='wiki-route'>
                <div>
                    <button onClick={this.saveChanges}>Save changes</button>
                    <button onClick={this.discardChanges}>Discard changes</button>
                </div>
                <h1>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                <div style={{ padding: '5rem' }}>
                    <WikiEditor
                        onChange={this.onChange}
                        content={this.state.editorContent}
                        readOnly={false}
                    />
                </div>
            </div>
        )
    }
}


const mapStateToProps: MapStateToProps<WikiEditPageReduxProps, WikiEditPageOwnProps, AppState> = (state, props) => {
    return {
        selectedWiki: state.selectedWiki
    };
}



export default connect(mapStateToProps, {
    fsError
})(WikiEditPage);