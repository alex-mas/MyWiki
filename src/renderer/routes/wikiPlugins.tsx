import * as React from 'react';
import WikiHeader from '../components/wikiHeader';
import {connect} from 'react-redux';
import { AppState } from '../store/store';
import { PluginState } from '../store/reducers/plugins';


export class WikiPluginsPage extends React.Component<{plugins: PluginState}, any>{
    render() {
        return (
            <div className='wiki-route'>
                <WikiHeader/>
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
            </div>
        )
    }
}


export default connect((state: AppState, props)=>{
    return {
        plugins: state.plugins
    }
}, {

})(WikiPluginsPage);