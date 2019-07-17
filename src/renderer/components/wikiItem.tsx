import * as React from 'react';
import { RouteProps } from '../router/router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata } from '../store/reducers/wikis';
import { selectWiki, SelectWikiActionCreator, removeWiki, loadWiki, LoadWikiActionCreator } from '../actions/wikis';
import { ActionCreator } from 'redux';
import { withPrompt, PromptComponentProps } from '@axc/react-components/prompt';
import I18String from '@axc/react-components/i18string';
import { Button } from './button';
import { DeletePrompt, DeletePromptFunction } from './deletePrompt';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { MemoryHistory } from 'history';
import { removeExternalWiki } from '../actions/appData';



interface WikiItemOwnProps extends RouteComponentProps {
    wiki: WikiMetadata
}

interface WikiItemDispatchProps {
    selectWiki: SelectWikiActionCreator,
    removeWiki: ActionCreator<any>,
    loadWiki: LoadWikiActionCreator,
    removeExternalWiki: typeof removeExternalWiki
}

interface WikiItemPromptProps {
    prompt: DeletePromptFunction;
}

type WikiItemProps = WikiItemOwnProps & WikiItemDispatchProps & WikiItemPromptProps;


export class WikiItem extends React.Component<WikiItemProps, any>{
    constructor(props: WikiItemProps) {
        super(props);
    }
    onOpen = () => {
        (this.props.selectWiki(this.props.wiki.id) as unknown as Promise<any>).then(() => {
            this.props.history.push('/wiki/article/home');
        }).catch((e: NodeJS.ErrnoException) => console.warn('Error while loading wiki: ', e));

    }
    removeWiki = () => {
        this.props.prompt(DeletePrompt, { title: 'do you really wish to remove this wiki?' })
            .then((response: boolean) => {
                if (response) {
                    if (this.props.wiki.path) {
                        console.log('removing wiki');
                        this.props.removeExternalWiki(this.props.wiki.path);
                    } else {
                        this.props.removeWiki(this.props.wiki);
                    }
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
                        <I18String text='open' />
                    </Button>
                    <Button
                        btnType='flat'
                        theme='primary'
                        onClick={this.removeWiki}
                    >
                        <I18String text='remove' format='capitalizeFirst' />
                    </Button>
                </div>
            </li>
        );
    }
}



export default withPrompt<any>(withRouter(connect(
    undefined,
    {
        selectWiki,
        removeWiki,
        loadWiki,
        removeExternalWiki
    }
    //@ts-ignore
)(WikiItem)));