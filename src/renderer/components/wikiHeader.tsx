import * as React from 'react';
import Header from './header';
import Modal from '@axc/react-components/layout/modal';
import CreateWikiForm from './createWikiForm';
import { withHistoryContext, MemoryHistory, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import HomeButton from './homeButton';
import WikiSearchBar from './wikiSearchBar';

export interface WikiHeaderProps {

}

export interface WikiHeaderState {

}

class WikiHeader extends React.Component<WikiHeaderProps, any>{
    constructor(props: WikiHeaderProps) {
        super(props);
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
                    <MemoryLink
                        className='wiki-header__action'
                        to={`/wiki/plugins`}
                    >
                        <i className='material-icons'>
                            extension
                        </i>
                    </MemoryLink>
                </div>
            </Header>
        )
    }
}



export default WikiHeader;