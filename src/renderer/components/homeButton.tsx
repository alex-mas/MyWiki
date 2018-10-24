import * as React from 'react';
import { MemoryLink } from '@axc/react-components/dist/navigation/memoryRouter';

export class HomeButton extends React.Component<any, any>{
    render() {
        return (
            <MemoryLink
                to='/'
                className='wiki-header__action'
            >
                <i
                    className='material-icons wiki-header__icon'
                >
                    home
                </i>
            </MemoryLink>
        )

    }
}


export default HomeButton;