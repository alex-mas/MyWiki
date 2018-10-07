import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import Wiki from '../components/wikiItem';
import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import MyEditor from '../components/wikiEditor/wikiEditor';
import AppHeader from '../components/appHeader';

export interface HomePageProps extends MemoryRouteProps {
    wikis: WikiMetaData[]
}

export class HomePage extends React.Component<HomePageProps, any>{
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
                    <h1 className='body__title'>Current wikis</h1>
                    <ul className='wiki-list'>
                        {this.props.wikis.map((wiki) => {
                            return <li className='wiki-list__item'><Wiki wiki={wiki} /></li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}


const mapStateToProps: MapStateToProps<Pick<AppState, 'wikis'>, HomePageProps, AppState> = (state, props) => {
    return {
        wikis: state.wikis
    };
}




export default connect(mapStateToProps, {

})(HomePage);