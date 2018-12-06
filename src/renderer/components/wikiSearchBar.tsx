import * as React from 'react';
import { connect } from 'react-redux';
import { getArticleNames } from '../selectors/articles';
import { AppState } from '../store/store';
import AutoComplete from '@axc/react-components/interactive/autoComplete';
import { withHistoryContext, MemoryHistory } from '@axc/react-components/navigation/memoryRouter';
import { getSelectedWiki } from '../selectors/wikis';
import { reduxI18nService, i18n} from '../app';


interface OwnProps {
    history: MemoryHistory
}
interface DispatchProps {

}

interface ReduxProps {
    articleNames: string[]
}

type ComponentProps = DispatchProps & OwnProps & ReduxProps;


interface ComponentState {
    value: string
}



export class WikiSearchBar extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
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
                placeholder={i18n('search article')}
                getSuggestions={this.getSuggestions}
                onChange={this.onChange}
                onSubmit={this.visitArticle}
                className='wiki-header__search-bar'
            />
        )
    }
}

export default withHistoryContext(connect(
    (state: AppState, props) => {
        return {
            articleNames: getArticleNames(getSelectedWiki(state))
        }
    },
    {

    }
)(WikiSearchBar));