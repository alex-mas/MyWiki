import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { AppState } from '../store/store';
import { connect} from 'react-redux';
import WikiHeader from '../components/wikiHeader';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki } from '../selectors/wikis';
import Notifications from './notifications';




interface OwnProps {
    background?: string
}

interface ReduxProps {
    selectedWiki: WikiMetadata
}


export type ComponentProps = OwnProps & ReduxProps;

interface ComponentState {
}


export class WikiView extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);

    }
    getBackground = () => {
        let background;
        if (this.props.background) {
            background = this.props.background;
        } else if (this.props.selectedWiki.background) {
            background = this.props.selectedWiki.background;
        } else {
            //fallback
        }
        return background;
    }
    render() {
        return (
            <div className='route'>
                <img className='route__background' src={this.getBackground()} alt="background" />
                <WikiHeader />
                {this.props.children}
                <Notifications />
            </div>
        )
    }
}




export default connect((state: AppState, props) => {
    return {
        selectedWiki: getSelectedWiki(state)
    };
})(WikiView);