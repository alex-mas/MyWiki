import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import WikiEditor from '../components/wikiEditor/wikiEditor';
import SlateEditor from '../components/wikiEditor/slateEditor';
import * as ReactMarkdown from 'react-markdown';
import { ValueJSON } from 'slate';

export interface WikiEditPageOwnProps extends MemoryRouteProps {
}

export type WikiEditPageReduxProps = Pick<AppState, 'selectedWiki'>

export interface WikiEditPageProps extends MemoryRouteProps, WikiEditPageReduxProps {
}

//  <ReactMarkdown source={fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiEditPage extends React.Component<WikiEditPageProps, any>{
    constructor(props: WikiEditPageProps) {
        super(props);
    }
    getArticleContent = () => {
        let content;
        try {
            if (this.props.routeParams && this.props.routeParams.article) {
                content = fs.readFileSync(path.join(this.props.selectedWiki.path, `${this.props.routeParams.article}.json`), 'utf8');
            } else {
                content = fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.json'), 'utf8');
            }
        } catch (e) {
            console.warn(e);
        }
        console.log('Content loaded from file: ', content);
        if(content){return JSON.parse(content);}
    }

    onSaveChanges = (contents: ValueJSON) => {
        try {
            fs.writeFileSync(path.join(this.props.selectedWiki.path, `${this.props.routeParams.article}.json`), JSON.stringify(contents), 'utf8');
        } catch (e) {
            console.warn(e);
        }
    }
    onDiscardChanges = (contents: ValueJSON) => {
        this.props.history.pushState(`wiki/${this.props.routeParams.article ? this.props.routeParams.article : 'home'}`);
    }
    render() {
        const article = this.props.routeParams.article;
        return (
            <div>
                <h1>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                <div style={{ padding: '5rem' }}>
                    <SlateEditor
                        content={this.getArticleContent()}
                        readOnly={false}
                        saveChanges={this.onSaveChanges}
                        discardChanges={this.onDiscardChanges}
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

})(WikiEditPage);