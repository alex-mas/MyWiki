import * as React from 'react';
import Header from './header';
import Modal from '@axc/react-components/dist/layout/modal';
import CreateWikiForm from './createWikiForm';
import { withHistoryContext, MemoryHistory, MemoryLink} from '@axc/react-components/dist/navigation/memoryRouter';
import HomeButton from './homeButton';


export interface AppHeaderProps {
    
}

export interface AppHeaderState {
    shouldRenderWikiForm: boolean;

}

class AppHeader extends React.Component<AppHeaderProps, AppHeaderState>{
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
                <HomeButton/>
                <div className='wiki-header__actions'>
                    <button
                        className='wiki-header__action--secondary'
                        onClick={this.toggleWikiForm}
                    >
                        <i className='material-icons'>add</i>
                    </button>
                    <MemoryLink
                        to='/settings'
                        className='wiki-header__action--secondary'
                    >
                        <i className='material-icons'>settings</i>
                    </MemoryLink>
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



export default AppHeader;