import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import Wiki from '../components/wikiItem';
import { BrowserRouteProps, BrowserLink } from '../../../../../libraries/alex components/dist/navigation/browserRouter';

export interface HomePageProps extends BrowserRouteProps{
    wikis: WikiMetaData[]
}

export class HomePage extends React.Component<HomePageProps, any>{
    constructor(props: HomePageProps) {
        super(props);
    }
    render() {
        return (
            <div>
                <h1>Wikis</h1>
                <ul>
                    {this.props.wikis.map((wiki) => {
                        return<li><Wiki wiki={wiki}/></li>
                    })}
                </ul>
                <BrowserLink to='/createWiki' text='Create new wiki'/>
                <button>Import existing wiki</button>
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