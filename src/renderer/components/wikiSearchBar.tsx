import * as React from 'react';
import { connect } from 'react-redux';
import { getArticleNames } from '../selectors/articles';
import { AppState } from '../store/store';
import AutoComplete from '@axc/react-components/interactive/autoComplete';
import { withHistoryContext, MemoryHistory } from '@axc/react-components/navigation/memoryRouter';

export interface WSBOwnProps {
    history: MemoryHistory
}
export interface WSBDispatchProps {

}

export interface WSBDStateProps {
    articleNames: string[]
}

export type WSBProps = WSBDispatchProps & WSBOwnProps & WSBDStateProps;


export interface WSBState {
    value: string
}



export class WikiSearchBar extends React.Component<WSBProps, WSBState>{
    constructor(props: WSBProps) {
        super(props);
        this.state = {
            value: ''
        }
    }
    getSuggestions = (value: string) => {
        return this.props.articleNames.filter((article) => article.includes(value));
    }
    onChange = (value: string) => {
        this.setState(() => ({
            value
        }));
    }
    validateInput(val: string): string {
        return val.trim();
    }
    visitArticle = (val: string) => {
        const value = this.validateInput(val);
        const matchingArticles = this.props.articleNames.filter((article) => article.includes(value));
        if (matchingArticles.length === 1 && matchingArticles[0] === value) {
            this.props.history.pushState(`/wiki/article/${value}`);
        } else {
            this.props.history.pushState(`/wiki/search/${value}`);
        }
    }
    render() {
        return (
            <AutoComplete
                value={this.state.value}
                placeholder='search article'
                getSuggestions={this.getSuggestions}
                onChange={this.onChange}
                onSubmit={this.visitArticle}
                className='wiki-header__search-bar'
            />
        )
    }
}

export default withHistoryContext(connect<WSBDStateProps, WSBDispatchProps, WSBOwnProps, AppState>((state, props) => {
    return {
        articleNames: getArticleNames(state.selectedWiki)
    }
}, {

    })(WikiSearchBar));