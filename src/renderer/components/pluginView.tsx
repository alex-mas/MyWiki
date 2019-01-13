import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { AppState } from '../store/store';
import { connect} from 'react-redux';
import WikiHeader from '../components/wikiHeader';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki } from '../selectors/wikis';
import Notifications from './notifications';
import WikiView  from './wikiView';
import { RouteComponentProps } from 'react-router';




interface OwnProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

interface ReduxProps {
    selectedWiki: WikiMetadata
}


export type ComponentProps = OwnProps & ReduxProps;

interface ComponentState {
}


export class PluginView extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);

    }
    render() {
        return (
            <WikiView>
                <this.props.component/>
            </WikiView>
        )
    }
}




export default PluginView;