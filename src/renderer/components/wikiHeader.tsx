import * as React from 'react';
import Header from './header';
import Modal from '@axc/react-components/modal';
import { Link } from 'react-router-dom';
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
    onCreateArticle = () => {

    }
    render() {
        return (
            <Header>
                <div className='wiki-header__top-actions'>
                    <HomeButton className='page-action' />
                </div>
                <div className='wiki-header__bottom-actions'>
                    {this.props.children}
                    <Notifications />
                </div>
            </Header>
        )
    }
}



export default WikiHeader;