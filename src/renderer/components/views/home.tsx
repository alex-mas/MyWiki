import * as React from 'react';
import { RouteProps } from '../../router/router';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata, UserDefinedWikiMetadata } from '../../store/reducers/wikis';
import Wiki from '../wikiItem';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import Modal from '@axc/react-components/layout/modal';
import AppHeader from '../appHeader';
import { AppData } from '../../store/reducers/appData';
import { Button } from '../button';
import { createWiki } from '../../actions/wikis';
import WikiForm from '../wikiForm';
import AppView from '../appView';


interface OwnProps extends MemoryRouteProps{

}

interface ReduxProps {
    appData: AppData;
    wikis: WikiMetadata[];
    createWiki: typeof createWiki;
}

type ComponentProps =  OwnProps & ReduxProps;

interface ComponentState {
    shouldRenderWikiForm: boolean;
}

export class HomePage extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
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
    createWiki = (metaData: UserDefinedWikiMetadata) => {
        event.preventDefault();
        this.props.createWiki(metaData);
        this.props.history.pushState('/');
    }
    render() {
        return (
            <AppView>
                <div className='body'>
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
            </AppView>
        );
    }
}




export default connect(
    (state: AppState, props) => {
        return {
            wikis: state.wikis,
            appData: state.appData
        }
    },
    {
        createWiki
    }
)(HomePage);