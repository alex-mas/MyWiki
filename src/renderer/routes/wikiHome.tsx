import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import * as ReactMarkdown from 'react-markdown';

export interface WikiHomePageOwnProps extends MemoryRouteProps {
}

export type WikiHomePageReduxProps = Pick<AppState, 'selectedWiki'>

export interface WikiHomePageProps extends MemoryRouteProps, WikiHomePageReduxProps {
}

export class WikiHomePage extends React.Component<WikiHomePageProps, any>{
    constructor(props: WikiHomePageProps) {
        super(props);
    }
    render() {
        return (
            <div>
                <h1>{this.props.selectedWiki.name}</h1>
                <div
                    className='the markdown'
                >
                    <ReactMarkdown source={fs.readFileSync(path.join(this.props.selectedWiki.path, 'home.md'), 'utf8')}/>
                </div>
            </div>
        )
    }
}


const mapStateToProps: MapStateToProps<WikiHomePageReduxProps, WikiHomePageOwnProps, AppState> = (state, props) => {
    return {
        selectedWiki: state.selectedWiki
    };
}



export default connect(mapStateToProps, {

})(WikiHomePage);