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



interface OwnProps {
    isOpen: boolean
}
interface ReduxProps {
    wiki: WikiMetadata,
    pluginsActions: PluginMenuAction[][]
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
                                    wikiID={this.props.wiki.id}
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
                        <section className='wiki-menu__section'>
                            <li className='wiki-menu__item'>
                                <Link
                                    className='wiki-menu__link'
                                    to='/wiki/articles'
                                >
                                    <i className='material-icons'>
                                        subject
                                    </i>
                                    <I18String text='articles' />
                                </Link>
                            </li>

                        </section>
                        {
                            this.props.pluginsActions.map((pluginActions) => {
                                return (
                                    <section className='wiki-menu__section'>
                                        {pluginActions.map((action) => {
                                            return (
                                                <li className='wiki-menu__item'>
                                                    <a
                                                        className='wiki-menu__link'
                                                        onClick={action.onClick}
                                                    >
                                                        <i className='material-icons'>
                                                            {action.icon}
                                                        </i>
                                                        <I18String text={action.text} format='capitalizeFirst' />
                                                    </a>
                                                </li>
                                            )
                                        })}
                                    </section>
                                )
                            })
                        }
                    </ul>
                </div>

            )
        } else {
            return null;
        }
    }
}



export default connect((state: AppState, props) => {
    return {
        wiki: getSelectedWiki(state),
        pluginsActions: getPluginMenuActions(state)
    }
})(WikiMenu);