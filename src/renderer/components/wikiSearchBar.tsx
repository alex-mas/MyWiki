import * as React from 'react';
import { connect } from 'react-redux';
import { getArticleNames } from '../selectors/articles';
import { AppState } from '../store/store';
import AutoComplete from '../../../../../libraries/alex components/dist/interactive/autoComplete';
import { withHistoryContext, MemoryHistory } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';

export interface WSBOwnProps {
    history: MemoryHistory,
    placeholder: string
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
        console.log(this.state.value, this.props.articleNames);
        return this.props.articleNames.filter((article) => article.includes(value));
    }
    onChange = (value: string) => {
        this.setState(() => ({
            value
        }));
    }
    visitArticle = () => {
        const matchingArticles = this.props.articleNames.filter((article) => article.includes(this.state.value));
        if (matchingArticles.length === 1) {
            console.log(`/wiki/article/${this.state.value}`)
            this.props.history.pushState(`/wiki/article/${this.state.value}`);
        } else {
            console.log(`/wiki/articleSearch/${this.state.value}`)
            this.props.history.pushState(`/wiki/articleSearch/${this.state.value}`);
        }
    }
    render() {
        return (
            <div>
                <AutoComplete
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    getSuggestions={this.getSuggestions}
                    onChange={this.onChange}
                />
                <button onClick={this.visitArticle}>Go</button>
            </div>
        )
    }
}

export default withHistoryContext(connect<WSBDStateProps, WSBDispatchProps, WSBOwnProps, AppState>((state, props) => {
    console.log(state.selectedWiki, getArticleNames(state.selectedWiki));
    return {
        articleNames: getArticleNames(state.selectedWiki)
    }
}, {

    })(WikiSearchBar));