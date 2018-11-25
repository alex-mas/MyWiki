import * as React from 'react';
import WikiHeader from '../wikiHeader';
import {connect} from 'react-redux';
import { AppState } from '../../store/store';
import { PluginState } from '../../store/reducers/plugins';
import WikiView  from '../wikiView';
import { loadPlugin } from '../../actions/plugins';

interface OwnProps {
 
}
interface ReduxProps {
    plugins: PluginState
}
interface DispatchProps{
    loadPlugin:typeof loadPlugin;
}
type ComponentProps = OwnProps  & ReduxProps & DispatchProps;

export class WikiPluginsPage extends React.Component<ComponentProps, any>{
    render() {
        return (
            <WikiView>
                <div className='body'>
                    {this.props.plugins.map((plugin)=>{
                        return(
                            <div>
                                {plugin.name} -  {plugin.version} - {plugin.id} - {plugin.loaded ? 'loaded' : 'not loaded'}
                                {plugin.description}
                                Main: {plugin.main}
                                <button onClick={()=>this.props.loadPlugin(plugin)}>test</button>
                            </div>
                        )
                    })}
                </div>
            </WikiView>
        )
    }
}


export default connect((state: AppState, props: OwnProps)=>{
    return {
        plugins: state.plugins
    }
}, {
    loadPlugin
})(WikiPluginsPage);