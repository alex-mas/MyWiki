import * as React from 'react';
import { RouteProps } from '../router/router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata } from '../store/reducers/wikis';
import { selectWiki, SelectWikiActionCreator, removeWiki, loadWiki, LoadWikiActionCreator } from '../actions/wikis';
import { MemoryHistory, withHistoryContext } from '@axc/react-components/navigation/memoryRouter';
import { ActionCreator } from 'redux';
import {withPrompt, PromptComponentProps} from '@axc/react-components/interactive/prompt';
import I18String from '@axc/react-components/display/i18string';
import { Button } from './button';
import { DeletePrompt, DeletePromptProps, DeletePromptFunction } from './deletePrompt';

export interface WikiItemOwnProps {
    wiki: WikiMetadata,
    history: MemoryHistory
}

export interface WikiItemDispatchProps {
    selectWiki: SelectWikiActionCreator,
    removeWiki: ActionCreator<any>,
    loadWiki: LoadWikiActionCreator
}

export interface WikiItemPromptProps {
    prompt:DeletePromptFunction;
}

export type WikiItemProps = WikiItemOwnProps & WikiItemDispatchProps & WikiItemPromptProps;


class WikiItem extends React.Component<WikiItemProps, any>{
    constructor(props: WikiItemProps) {
        super(props);
    }
    onOpen = () => {
        //@ts-ignore
        this.props.selectWiki(this.props.wiki.id).then(() => {
            this.props.history.pushState('/wiki/article/home');
        }).catch((e: NodeJS.ErrnoException) => console.warn('Error while loading wiki: ', e));

    }
    removeWiki = () => {
        this.props.prompt(DeletePrompt,{title:'do you really wish to remove this wiki?'}).then((response: boolean)=>{
            if(response){
                this.props.removeWiki(this.props.wiki);
            }
        });
    }
    render() {
        return (
            <li className='wiki-item'>
                <div className='wiki-item__text'>
                    <h3 className='wiki-item__title'>{this.props.wiki.name}</h3>
                    <div className='wiki-item__description'>{this.props.wiki.description}</div>
                </div>
                <div className='wiki-item__actions'>
                    <Button
                        btnType='solid'
                        theme='primary'
                        onClick={this.onOpen}
                    >
                        <I18String text='open'/>
                    </Button>
                    <Button
                        btnType='flat'
                        theme='primary'
                        onClick={this.removeWiki}
                    >
                        <I18String text='remove' format='capitalizeFirst'/>
                    </Button>
                </div>
            </li>
        );
    }
}


//@ts-ignore
export default withPrompt<any>(withHistoryContext(connect<{}, WikiItemDispatchProps, WikiItemOwnProps, any>(undefined, {
    selectWiki,
    removeWiki,
    loadWiki
})(WikiItem)));