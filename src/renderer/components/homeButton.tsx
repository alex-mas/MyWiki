import * as React from 'react';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';


export class HomeButton extends React.Component<any, any>{
    render() {
        return (
            <MemoryLink
                to='/'
                className='wiki-header__home-btn'
            >
                <img className='wiki-header__home-btn__image' src='resources/images/appIcon.png'/>
            </MemoryLink>
        )

    }
}


export default HomeButton;