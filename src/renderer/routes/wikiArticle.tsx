import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import WikiEditor from '../components/wikiEditor/wikiEditor';
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
    getArticleContent = () =>{
        let content;
        try{
           content = fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.json'), 'utf8');
        }catch(e){
            console.warn(e);
        }
        return content;

    }
    render() {
        return (
            <div>
                <h1>{this.props.selectedWiki.name}</h1>
                <div
                >
                    <button>Create new article</button>
                    <WikiEditor
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