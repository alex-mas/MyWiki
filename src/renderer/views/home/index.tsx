import * as React from 'react';
import { RouteProps } from '../../router/router';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../../store/reducers/wikis';
import Wiki from '../../components/wikiItem';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import Modal from '@axc/react-components/layout/modal';
import MyEditor from '../../components/wikiEditor/wikiEditor';
import AppHeader from '../../components/appHeader';
import { AppData } from '../../store/reducers/appData';
import { Button } from '../../components/button';
import { UserWikiData, createWiki } from '../../actions/wikis';
import WikiForm from '../../components/wikiForm';


export interface HomePageOwnProps {

}
export interface HomePageReduxProps {
    appData: AppData;
    wikis: WikiMetaData[];
    createWiki: typeof createWiki;
}

export type HomePageProps = MemoryRouteProps & HomePageOwnProps & HomePageReduxProps;
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
    createWiki = (metaData: UserWikiData)=>{
        event.preventDefault();
        this.props.createWiki(metaData);
        this.props.history.pushState('/');
    }
    render() {
        return (
            <div className='wiki-route'>
                <AppHeader />
                <div className='body'>
                    <img className='wiki-background' src={this.props.appData.background} alt="" />
                        <ul className='wiki-list'>
                            {this.props.wikis.map((wiki) => {
                                return <Wiki key={wiki.id} wiki={wiki} />
                            })}
                            <div key='wiki-list__actions' className='wiki-list__actions'>
                                <Button
                                    btnType='solid'
                                    theme='primary'
                                    className='wiki-list__action--primary'
                                    onClick={this.toggleWikiForm}
                                >
                                    <i className='material-icons'>add</i>
                                </Button>
                            </div>
                        </ul>  
                    <Modal
                        isOpen={this.state.shouldRenderWikiForm}
                        onClose={this.toggleWikiForm}
                        className='modal'
                    >
                        <WikiForm
                            onClose={this.toggleWikiForm}
                            onSubmit={this.createWiki}
                        />
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
    createWiki
})(HomePage);