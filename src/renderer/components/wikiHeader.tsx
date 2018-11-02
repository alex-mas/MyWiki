import * as React from 'react';
import Header from './header';
import Modal from '@axc/react-components/layout/modal';
import CreateWikiForm from './createWikiForm';
import { withHistoryContext, MemoryHistory, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import HomeButton from './homeButton';
import WikiSearchBar from './wikiSearchBar';
import WikiMenu from './wikiMenu';

export interface WikiHeaderProps {

}

export interface WikiHeaderState {
    isMenuOpen: boolean
}

class WikiHeader extends React.Component<WikiHeaderProps, WikiHeaderState>{
    constructor(props: WikiHeaderProps) {
        super(props);
        this.state = {
            isMenuOpen: false
        }
    }
    onToggleHeaderMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState((prevState) => ({
            isMenuOpen: !prevState.isMenuOpen
        }));
    }
    render() {
        return (
            <Header>
                <HomeButton />
                <WikiSearchBar />
                <div className='wiki-header__actions'>
                    <MemoryLink
                        className='wiki-header__action'
                        to={`/wiki/create/`}
                    >
                        <i className='material-icons'>
                            add
                        </i>
                    </MemoryLink>
                    <button
                        type='button'
                        className='wiki-header__action'
                        onClick={this.onToggleHeaderMenu}
                    >
                        <i className='material-icons'>
                            menu
                        </i>
                    </button>
                    <WikiMenu isOpen={this.state.isMenuOpen} />
                </div>
            </Header>
        )
    }
}



export default WikiHeader;