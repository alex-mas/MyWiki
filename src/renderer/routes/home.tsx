import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import Wiki from '../components/wikiItem';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/dist/navigation/memoryRouter';
import Modal from '@axc/react-components/dist/layout/modal';
import MyEditor from '../components/wikiEditor/wikiEditor';
import AppHeader from '../components/appHeader';
import CreateWikiForm from '../components/createWikiForm';
import { AppData } from '../store/reducers/appData';


export interface HomePageProps extends MemoryRouteProps {
    wikis: WikiMetaData[],
    appData: AppData
}

export interface HomePageState {
    shouldRenderWikiForm: boolean;
}

export class HomePage extends React.Component<HomePageProps, HomePageState>{
    constructor(props: HomePageProps) {
        super(props);
        this.state = {
            shouldRenderWikiForm: false
        }
    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = `MyWiki - Home`;
    }
    toggleWikiForm = () => {
        this.setState((prevState) => ({
            shouldRenderWikiForm: !prevState.shouldRenderWikiForm
        }));
    }
    render() {
        return (
            <div className='wiki-route'>
                <AppHeader />
                <div className='body'>
                    <img className='wiki-background' src={this.props.appData.backgroundImage} alt="" />
                    <ul className='wiki-list'>
                        {this.props.wikis.map((wiki) => {
                            return <Wiki key={wiki.id} wiki={wiki} />
                        })}
                        <div key='wiki-list__actions'className='wiki-list__actions'>
                            <button
                             
                                className='wiki-button--primary'
                                onClick={this.toggleWikiForm}
                            >
                                <i className='material-icons'>add</i>
                            </button>
                        </div>
                    </ul>
                    <Modal
                        isOpen={this.state.shouldRenderWikiForm}
                        onClose={this.toggleWikiForm}
                        className='create-wiki__modal'
                    >
                        <CreateWikiForm />
                    </Modal>
                </div>
            </div>
        );
    }
}


const mapStateToProps: MapStateToProps<Pick<AppState, 'wikis'>, HomePageProps, AppState> = (state, props) => {
    return {
        wikis: state.wikis,
        appData: state.appData
    };
}




export default connect(mapStateToProps, {

})(HomePage);