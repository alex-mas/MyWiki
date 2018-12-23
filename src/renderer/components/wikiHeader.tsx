import * as React from 'react';
import Header from './header';
import Modal from '@axc/react-components/modal';
import {Link } from 'react-router-dom';
import HomeButton from './homeButton';
import WikiSearchBar from './wikiSearchBar';
import WikiMenu from './wikiMenu';
import Notifications from './notifications';

interface WikiHeaderProps {

}

interface WikiHeaderState {
    isMenuOpen: boolean,
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
                    <Link
                        className='wiki-header__action'
                        to='/wiki/create/'
                    >
                        <i className='material-icons'>
                            add
                        </i>
                    </Link>
                    <button
                        type='button'
                        className='wiki-header__action'
                        onClick={this.onToggleHeaderMenu}
                    >
                        <i className='material-icons'>
                            menu
                        </i>
                    </button>
                    <WikiMenu
                        isOpen={this.state.isMenuOpen}
                    />
                </div>
            </Header>
        )
    }
}



export default WikiHeader;