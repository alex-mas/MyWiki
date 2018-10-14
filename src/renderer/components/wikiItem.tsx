import * as React from 'react';
import { RouteProps } from '../router/router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import { selectWiki, SelectWikiActionCreator, removeWiki, loadWiki, LoadWikiActionCreator } from '../actions/wikis';
import { MemoryHistory, withHistoryContext } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { ActionCreator } from 'redux';


export interface WikiItemOwnProps {
    wiki: WikiMetaData,
    history: MemoryHistory
}

export interface WikiItemDispatchProps {
    selectWiki: SelectWikiActionCreator,
    removeWiki: ActionCreator<any>,
    loadWiki: LoadWikiActionCreator
}


export type WikiItemProps = WikiItemOwnProps & WikiItemDispatchProps;


class WikiItem extends React.Component<WikiItemProps, any>{
    constructor(props: WikiItemProps) {
        super(props);
    }
    onOpen = () => {
        console.log('about to open a wiki')
        //@ts-ignore
        this.props.loadWiki(this.props.wiki.id).then(()=>{
            console.log('loadWiki finished executing');
            this.props.history.pushState('/wiki/article/home');
        }).catch((e: any)=>console.warn('Error while loading wiki: ',e));

    }
    removeWiki = () => {
        this.props.removeWiki(this.props.wiki);
    }
    render() {
        return (
            <div className='wiki-item'>
                {this.props.wiki.name}
                <button className='page__action--secondary' onClick={this.onOpen}>Open</button>
                <button className='page__action--flat' onClick={this.removeWiki}>Remove</button>
            </div>
        );
    }
}



export default withHistoryContext(connect<{}, WikiItemDispatchProps, WikiItemOwnProps, any>(undefined, {
    selectWiki,
    removeWiki,
    loadWiki
})(WikiItem));