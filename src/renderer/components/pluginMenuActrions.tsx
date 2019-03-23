import * as React from 'react';
import { connect } from 'react-redux';
import I18String from '@axc/react-components/i18string';
import { AppState } from '../store/store';
import { getPluginMenuActions } from '../selectors/plugins';
import { PluginMenuAction } from '../store/reducers/plugins';



interface OwnProps {

}
interface ReduxProps {
    pluginsActions: PluginMenuAction[][]
}
type ComponentProps = OwnProps & ReduxProps;

export class PluginMenuActions extends React.Component<ComponentProps, any>{
    render() {
        return this.props.pluginsActions.map((pluginActions) => {
            if (pluginActions.length === 0) {
                return null;
            }
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
        });
    }
}



export default connect((state: AppState, props) => {
    return {
        pluginsActions: getPluginMenuActions(state)
    }
})(PluginMenuActions);