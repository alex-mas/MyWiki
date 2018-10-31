import * as React from 'react';
import { RouteProps } from '../router/router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import { selectWiki, SelectWikiActionCreator, removeWiki, loadWiki, LoadWikiActionCreator } from '../actions/wikis';
import { MemoryHistory, withHistoryContext } from '@axc/react-components/dist/navigation/memoryRouter';
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
        //@ts-ignore
        this.props.loadWiki(this.props.wiki.id).then(() => {
            this.props.history.pushState('/wiki/article/home');
        }).catch((e: NodeJS.ErrnoException) => console.warn('Error while loading wiki: ', e));

    }
    removeWiki = () => {
        this.props.removeWiki(this.props.wiki);
    }
    render() {
        return (
            <li className='wiki-item'>
                <div className='wiki-item__text'>
                    <h3 className='wiki-item__title'>{this.props.wiki.name}</h3>
                    <div className='wiki-item__description'>description</div>
                </div>
                <div className='wiki-item__actions'>
                    <button
                        className='wiki-item__action text-action--contained'
                        onClick={this.onOpen}
                    >
                        Open
                    </button>
                    <button
                        className='wiki-item__action text-action--flat'
                        onClick={this.removeWiki}
                    >
                        Remove
                    </button>
                </div>
            </li>
        );
    }
}



export default withHistoryContext(connect<{}, WikiItemDispatchProps, WikiItemOwnProps, any>(undefined, {
    selectWiki,
    removeWiki,
    loadWiki
})(WikiItem));