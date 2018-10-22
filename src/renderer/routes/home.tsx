import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import Wiki from '../components/wikiItem';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/dist/navigation/memoryRouter';
import MyEditor from '../components/wikiEditor/wikiEditor';
import AppHeader from '../components/appHeader';
import CreateWikiForm from '../components/createWikiForm';

export interface HomePageProps extends MemoryRouteProps {
    wikis: WikiMetaData[]
}

export interface HomePageState {
    shouldRenderWikiForm: boolean;``
}

export class HomePage extends React.Component<HomePageProps, HomePageState>{
    constructor(props: HomePageProps) {
        super(props);

    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = `MyWiki - Home`;
    }
    render() {
        return (
            <div className='wiki-route'>
                <AppHeader />
                <div className='body'>
                    <ul className='wiki-list'>
                        <li className='wiki-list__header'>
                            <h2>Wikis</h2>
                        </li>
                        {this.props.wikis.map((wiki) => {
                            return <li className='wiki-list__item'><Wiki wiki={wiki} /></li>
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}


const mapStateToProps: MapStateToProps<Pick<AppState, 'wikis'>, HomePageProps, AppState> = (state, props) => {
    return {
        wikis: state.wikis
    };
}




export default connect(mapStateToProps, {

})(HomePage);