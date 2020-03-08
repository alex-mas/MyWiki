import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import AutoComplete from '@axc/react-components/autoComplete';
import { getSelectedWiki, getWikiById } from '../selectors/wikis';
import { i18n} from '../app';
import { withRouter, RouteComponentProps } from 'react-router';
import { ArticleMetaData } from '../actions/article';


interface OwnProps extends RouteComponentProps<{id: string}>{
}
interface DispatchProps {

}

interface ReduxProps {
    articles: ArticleMetaData[]
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
    getMatchingArticles  = (val:string)=>{
        const value = this.validateInput(val);
        return this.props.articles.filter(
            (article)=>article.name.includes(value) || article.tags.includes(value)
        ).map((articled)=>articled.name);
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
        const matchingArticles = this.getMatchingArticles(val);
        if (matchingArticles.length === 1 && matchingArticles[0] === value) {
            this.props.history.push(`/wiki/${this.props.match.params.id}/article/${value}`);
        } else {
            this.props.history.push(`/wiki/${this.props.match.params.id}/search/${value}`);
        }
    }
    render() {
        return (
            <AutoComplete
                value={this.state.value}
                placeholder={i18n('search article')}
                getSuggestions={this.getMatchingArticles}
                onChange={this.onChange}
                onSubmit={this.visitArticle}
                className='wiki-header__search-bar'
            />
        )
    }
}

export default withRouter(connect(
    (state: AppState, props: OwnProps) => {
        return {
            articles: getWikiById(state, props.match.params.id).articles
        }
    },
    undefined
)(WikiSearchBar));