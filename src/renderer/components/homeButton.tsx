import * as React from 'react';
import { Link } from 'react-router-dom';


export class HomeButton extends React.Component<any, any>{
    render() {
        return (
            <Link
                to='/'
                className='wiki-header__home-btn'
            >
                <img className='wiki-header__home-btn__image' src='resources/images/appIcon.png'/>
            </Link>
        )

    }
}


export default HomeButton;