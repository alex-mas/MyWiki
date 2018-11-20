import * as React from 'react';
import WikiHeader from '../wikiHeader';
import {connect} from 'react-redux';
import { AppState } from '../../store/store';
import { PluginState } from '../../store/reducers/plugins';
import WikiView  from '../wikiView';


interface OwnProps {
 
}
interface ReduxProps {
    plugins: PluginState
}

type ComponentProps = OwnProps  & ReduxProps;

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

})(WikiPluginsPage);