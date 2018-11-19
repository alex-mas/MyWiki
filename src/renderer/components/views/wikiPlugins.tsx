import * as React from 'react';
import WikiHeader from '../wikiHeader';
import {connect} from 'react-redux';
import { AppState } from '../../store/store';
import { PluginState } from '../../store/reducers/plugins';
import WikiView  from '../wikiView';


export class WikiPluginsPage extends React.Component<{plugins: PluginState}, any>{
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
                            </div>
                        )
                    })}
                </div>
            </WikiView>
        )
    }
}


export default connect((state: AppState, props)=>{
    return {
        plugins: state.plugins
    }
}, {

})(WikiPluginsPage);