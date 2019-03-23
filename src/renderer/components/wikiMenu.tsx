import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import I18String from '@axc/react-components/i18string';
import WikiSettingsButton from './wikiSettingsButton';
import { AppState } from '../store/store';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki } from '../selectors/wikis';
import { getPluginMenuActions } from '../selectors/plugins';
import { PluginMenuAction } from '../store/reducers/plugins';
import  PluginMenuActions  from './pluginMenuActrions';



interface OwnProps {
    isOpen: boolean
}

type ComponentProps = OwnProps;

export class WikiMenu extends React.Component<ComponentProps, any>{
    render() {
        if (this.props.isOpen) {
            return (
                <div className='wiki-menu__container'>
                    <ul className='wiki-menu'>
                        <section className='wiki-menu__section'>
                            <li className='wiki-menu__item'>
                                <Link
                                    className='wiki-menu__link'
                                    to='/wiki/article/home'
                                >
                                    <i className='material-icons'>
                                        home
                                    </i>
                                    <I18String text='home' />
                                </Link>
                            </li>
                            <li className='wiki-menu__item'>
                                <WikiSettingsButton
                                    className='wiki-menu__link'
                                />
                            </li>
                            <li className='wiki-menu__item'>
                                <Link
                                    className='wiki-menu__link'
                                    to='/wiki/plugins'
                                >
                                    <i className='material-icons'>
                                        extension
                                    </i>
                                    <I18String text='plugins' />
                                </Link>
                            </li>
                        </section>
                        <PluginMenuActions/>
                        <section className='wiki-menu__section--last'>
                            <li className='wiki-menu__item'>
                                <Link
                                    className='wiki-menu__link'
                                    to='/wiki/search/'
                                >
                                    <i className='material-icons'>
                                        subject
                                    </i>
                                    <I18String text='articles' />
                                </Link>
                            </li>
                        </section>
                    </ul>
                </div>

            )
        } else {
            return null;
        }
    }
}


export default WikiMenu;