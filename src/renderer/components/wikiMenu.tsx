import * as React from 'react';
import { connect } from 'react-redux';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import I18String from '@axc/react-components/display/i18string';
import  WikiSettingsButton  from './wikiSettingsButton';
import { AppState } from '../store/store';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki } from '../selectors/wikis';



interface OwnProps{
    isOpen: boolean
}
interface ReduxProps{
    wiki: WikiMetadata
}
type ComponentProps = OwnProps & ReduxProps;

export class WikiMenu extends React.Component<ComponentProps, any>{
    render() {
        if (this.props.isOpen) {
            return (
                <div className='wiki-menu__container'>
                    <ul className='wiki-menu'>
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
                            <I18String text='plugin defined actions' format='capitalizeFirst'/>
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
        wiki: getSelectedWiki(state)
    }
})(WikiMenu);