import * as React from 'react';
import { connect } from 'react-redux';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';




export class WikiMenu extends React.Component<any, any>{
    render() {
        if (this.props.isOpen) {
            return (
                <div className='wiki-menu__container'>
                    <ul className='wiki-menu__list'>
                    <li className='wiki-menu__item'>
                        <MemoryLink
                            className='wiki-menu__link'
                            to='/wiki/article/home'
                        >
                            <i className='material-icons'>
                                home
                            </i>
                            home
                        </MemoryLink>
                    </li>
                    <li className='wiki-menu__item'>

                        <MemoryLink
                            className='wiki-menu__link'
                            to='/wiki/settings'
                        >
                            <i className='material-icons'>
                                settings
                            </i>
                            settings
                        </MemoryLink>
                    </li>
                    <li   className='wiki-menu__item'> 
                        <MemoryLink
                            className='wiki-menu__link'
                            to='/wiki/plugins'
                        >
                            <i className='material-icons'>
                                extension
                            </i>
                            plugins
                        </MemoryLink>
                    </li>

                    </ul>
                </div>

            )
        } else {
            return null;
        }
    }
}



export default WikiMenu;