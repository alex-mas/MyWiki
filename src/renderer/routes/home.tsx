import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import Wiki from '../components/wikiItem';
import {addWiki} from '../actions/wikis';

export interface HomePageProps extends RouteProps {
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
                <button>Create new wiki</button>
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

const mapDispatchToProps: MapDispatchToProps<{}, HomePageProps> = (dispatch, props)=>{
    return {

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);