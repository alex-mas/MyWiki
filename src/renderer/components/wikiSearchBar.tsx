import * as React from 'react';
import { connect } from 'react-redux';
import { getArticleNames } from '../selectors/articles';
import { AppState } from '../store/store';
import AutoComplete from '@axc/react-components/autoComplete';
import { withHistory, History } from '@axc/react-components/historyRouter';
import { getSelectedWiki } from '../selectors/wikis';
import { reduxI18nService, i18n} from '../app';
import { withRouter, RouteComponentProps } from 'react-router';
import { MemoryHistory } from 'history';


interface OwnProps extends RouteComponentProps{
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
            this.props.history.push(`/wiki/article/${value}`);
        } else {
            this.props.history.push(`/wiki/search/${value}`);
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

export default connect(
    (state: AppState, props) => {
        return {
            articleNames: getArticleNames(getSelectedWiki(state))
        }
    },
    undefined
)(withRouter(WikiSearchBar));