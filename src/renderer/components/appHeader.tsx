import * as React from 'react';
import Header from './header';
import { MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import Modal from '../../../../../libraries/alex components/dist/layout/modal';
import CreateWikiForm from './createWikiForm';



export interface AppHeaderState {
    shouldRenderWikiForm: boolean;
}

class AppHeader extends React.Component<any, AppHeaderState>{
    constructor(props: any) {
        super(props);
        this.state = {
            shouldRenderWikiForm: false
        }
    }
    toggleWikiForm = () => {
        this.setState((prevState) => ({
            shouldRenderWikiForm: !prevState.shouldRenderWikiForm
        }));
    }
    render() {
        return (
            <Header>
                <i className='wiki-header__icon'>placeholder</i>
                <div className='wiki-header__actions'>
                    <button
                        className='page__action--secondary'
                        onClick={this.toggleWikiForm}
                    >
                        Create
                    </button>
                    <button className='page__action--secondary'>Settings</button>
                </div>
                <Modal
                    isOpen={this.state.shouldRenderWikiForm}
                    onClose={this.toggleWikiForm}
                >
                    <CreateWikiForm />
                </Modal>
            </Header>
        )
    }
}



export default AppHeader