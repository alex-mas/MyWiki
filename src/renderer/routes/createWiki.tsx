import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import Wiki from '../components/wikiItem';
import CreateWikiForm  from '../components/createWikiForm';
import { MemoryRouteProps } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';

export interface CreateWikiPageProps extends MemoryRouteProps {
    wikis: WikiMetaData[]
}

export class CreateWikiPage extends React.Component<CreateWikiPageProps, any>{
    constructor(props: CreateWikiPageProps) {
        super(props);
    }
    componentDidMount(){
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = `MyWiki - Create wiki`;
    }
    render() {
        return (
            <div className='wiki-route'>
                <h1 className='page__title'>Create a wiki</h1>
                <CreateWikiForm history={this.props.history}/>
            </div>
        )
    }
}




export default CreateWikiPage;