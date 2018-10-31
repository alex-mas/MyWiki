import * as React from 'react';
import Header from './header';

import CreateWikiForm from './createWikiForm';
import { withHistoryContext, MemoryHistory, MemoryLink} from '@axc/react-components/navigation/memoryRouter';
import HomeButton from './homeButton';


export interface AppHeaderProps {
    
}

export interface AppHeaderState {

}

class AppHeader extends React.Component<AppHeaderProps, AppHeaderState>{
    constructor(props: any) {
        super(props);

    }

    render() {
        return (
            <Header>
                <HomeButton/>
                <div className='wiki-header__actions'>
                    <MemoryLink
                        to='/settings'
                        className='wiki-header__action--secondary'
                    >
                        <i className='material-icons'>settings</i>
                    </MemoryLink>
                </div>
            </Header>
        )
    }
}



export default AppHeader;