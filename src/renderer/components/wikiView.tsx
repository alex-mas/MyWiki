import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import WikiHeader from '../components/wikiHeader';
import { WikiMetaData } from '../store/reducers/wikis';




interface WikiViewOwnProps {
    getBackground?: ()=>string
}

interface WikiViewReduxProps {
    selectedWiki: WikiMetaData
}


export type WikiViewProps = WikiViewOwnProps & WikiViewReduxProps;

interface WikiViewState {
}


export class WikiView extends React.Component<WikiViewProps, WikiViewState>{
    constructor(props: WikiViewProps) {
        super(props);

    }
    getBackground = () => {
        let background;
        //let the caller provide a customized background
        if(this.props.getBackground){
            background = this.props.getBackground();
        }else if(this.props.selectedWiki.background){
            background = this.props.selectedWiki.background;
        }else{
            //fallback
        }
        return background;
    }
    render() {
        return (
            <div className='wiki-route'>
                <img className='wiki-background' src={this.getBackground()} alt="background" />
                <WikiHeader/>
                {this.props.children}
            </div>
        )
    }
}




export default connect((state: AppState, props) => {
    return {
        selectedWiki: state.selectedWiki
    };
})(WikiView);