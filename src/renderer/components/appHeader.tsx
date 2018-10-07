import * as React from 'react';
import Header from './header';
import { MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';




class AppHeader extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <Header>
                <i className='wiki-header__icon'>placeholder</i>
                <div className='wiki-header__main-action'>
                    <MemoryLink className='page__action' to='/createWiki' text='Create new wiki' />
                </div>
                <div className='wiki-header__aux-actions'>
                    <button className='page__action--secondary'>Import from</button>
                    <button className='page__action--secondary'>Settings</button>
                    <button className='page__action--secondary'>Exit</button>
                </div>
            </Header>
        )
    }
}



export default AppHeader