import * as React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import I18String from '@axc/react-components/i18string';
import WikiSettingsButton from './wikiSettingsButton';
import { AppState } from '../store/store';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki } from '../selectors/wikis';
import { getPluginMenuActions } from '../selectors/plugins';
import { PluginMenuAction } from '../store/reducers/plugins';
import  PluginMenuActions  from './pluginMenuActrions';
import { useOnClickOutside } from '../hooks/useClickOutside';
import {useRef, useCallback} from 'react';


interface OwnProps {
    isOpen: boolean,
    onClose: ()=>void
}

type ComponentProps = OwnProps;


export const WikiMenu = (props: ComponentProps)=>{
    const match = useParams<{id:string}>();
    const menuRoot = useRef(null);
    const onClickOutside = useCallback((event: MouseEvent | TouchEvent)=>{
        props.onClose();
    },[props.onClose]);
    useOnClickOutside(menuRoot, onClickOutside);
    if (props.isOpen) {
        return (
            <div className='wiki-menu__container' ref={menuRoot}>
                <ul className='wiki-menu'>
                    <section className='wiki-menu__section'>
                        <li className='wiki-menu__item'>
                            <Link
                                className='wiki-menu__link'
                                to={`/wiki/${match.id}/`}
                            >
                                <i className='icon-btn--secondary material-icons'>
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
                                to={`/wiki/${match.id}/plugins/`}
                            >
                                <i className='icon-btn--secondary material-icons'>
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
                                to={`/wiki/${match.id}/search/`}
                            >
                                <i className='icon-btn--secondary material-icons'>
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


export default WikiMenu;