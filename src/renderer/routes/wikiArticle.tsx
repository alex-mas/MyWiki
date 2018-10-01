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

export interface WikiArticlePageOwnProps extends MemoryRouteProps {
}

export type WikiArticlePageReduxProps = Pick<AppState, 'selectedWiki'>

export interface WikiArticlePageProps extends MemoryRouteProps, WikiArticlePageReduxProps {
}

//  <ReactMarkdown source={fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.md'), 'utf8')}/>
export class WikiArticlePage extends React.Component<WikiArticlePageProps, any>{
    constructor(props: WikiArticlePageProps) {
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
    render() {
        const article = this.props.routeParams.article;
        console.log(article);
        return (
            <div>
                <div>
                    <button>Create new article</button>
                    <button>Delete article</button>
                    <MemoryLink to={`/wikiEdit/${article}`}> Edit Article</MemoryLink>
                </div>
                <h1>{article === 'home' ? this.props.selectedWiki.name : article}</h1>
                <div style={{ padding: '5rem' }}>
                    <SlateEditor
                        content={this.getArticleContent()}
                        readOnly={true}
                    />
                </div>
            </div>
        )
    }
}


const mapStateToProps: MapStateToProps<WikiArticlePageReduxProps, WikiArticlePageOwnProps, AppState> = (state, props) => {
    return {
        selectedWiki: state.selectedWiki
    };
}



export default connect(mapStateToProps, {

})(WikiArticlePage);