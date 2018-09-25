import * as React from 'react';
import { RouteProps } from '../router/router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import { selectWiki, SelectWikiActionCreator } from '../actions/wikis';
import { BrowserHistory, withHistoryContext } from '../../../../../libraries/alex components/dist/navigation/browserRouter';


export interface WikiItemOwnProps{
    wiki: WikiMetaData,
    history: BrowserHistory
}

export interface WikiItemDispatchProps {
    selectWiki: SelectWikiActionCreator;
}


export type WikiItemProps = WikiItemOwnProps & WikiItemDispatchProps;


class WikiItem extends React.Component<WikiItemProps, any>{
    constructor(props: WikiItemProps){
        super(props);
    }
    onOpen = ()=>{
        this.props.selectWiki(this.props.wiki.id);
        this.props.history.pushState('/wiki');
    }
    render(){
        return(
            <div>
                {this.props.wiki.name} 
                <button onClick={this.onOpen}>Open</button>
                <button>Untrack</button>
            </div>
        );
    }
}



export default withHistoryContext(connect<{}, WikiItemDispatchProps,WikiItemOwnProps, any>(undefined,{
    selectWiki
})(WikiItem));