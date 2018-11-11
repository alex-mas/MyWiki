import * as React from 'react';
import { connect } from 'react-redux';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import I18String from '@axc/react-components/display/i18string';
import  WikiSettingsButton  from './wikiSettingsButton';
import { AppState } from '../store/store';
import { WikiMetaData } from '../store/reducers/wikis';



interface OwnProps{
    isOpen: boolean
}
interface ReduxProps{
    wiki: WikiMetaData
}
type WikiMenuProps = OwnProps & ReduxProps;

export class WikiMenu extends React.Component<WikiMenuProps, any>{
    render() {
        if (this.props.isOpen) {
            return (
                <div className='wiki-menu__container'>
                    <ul className='wiki-menu__list'>
                        <section className='wiki-menu__section'>
                            <li className='wiki-menu__item'>
                                <MemoryLink
                                    className='wiki-menu__link'
                                    to='/wiki/article/home'
                                >
                                    <i className='material-icons'>
                                        home
                                    </i>
                                    <I18String text='home' />
                                </MemoryLink>
                            </li>
                            <li className='wiki-menu__item'>
                                <WikiSettingsButton 
                                    className='wiki-menu__link'
                                    wikiID={this.props.wiki.id}
                                />
                            </li>
                            <li className='wiki-menu__item'>
                                <MemoryLink
                                    className='wiki-menu__link'
                                    to='/wiki/plugins'
                                >
                                    <i className='material-icons'>
                                        extension
                                    </i>
                                    <I18String text='plugins' />
                                </MemoryLink>
                            </li>
                        </section>
                        <section className='wiki-menu__section'>
                            <li className='wiki-menu__item'>
                                <MemoryLink
                                    className='wiki-menu__link'
                                    to='/wiki/articles'
                                >
                                    <i className='material-icons'>
                                        subject
                                    </i>
                                    <I18String text='articles' />
                                </MemoryLink>
                            </li>

                        </section>
                        <section className='wiki-menu__section--last'>
                            plugin defined actions
                        </section>
                    </ul>
                </div>

            )
        } else {
            return null;
        }
    }
}



export default connect((state: AppState,props)=>{
    return{
        wiki: state.selectedWiki
    }
})(WikiMenu);