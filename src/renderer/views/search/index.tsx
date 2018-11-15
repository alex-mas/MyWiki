import * as React from 'react';
import { RouteProps } from '../../router/router';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../../store/reducers/wikis';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import { getRelevantArticles } from '../../selectors/articles';
import WikiHeader from '../../components/wikiHeader';
import I18String  from '@axc/react-components/display/i18string';



export interface ArticleSearchPageDispatchProps {
    fsError: FsErrorActionCreator
}


export interface ArticleSearchPageStateProps {
    searchResults: string[],
    selectedWiki: WikiMetaData
}

export interface ArticleSearchPageOwnProps extends RouteProps {
}

export type ArticleSearchPageProps = ArticleSearchPageOwnProps & ArticleSearchPageDispatchProps & ArticleSearchPageStateProps;


export interface ArticleSearchPageState {
}

export class ArticleSearchPage extends React.Component<ArticleSearchPageProps, ArticleSearchPageState>{
    constructor(props: ArticleSearchPageProps) {
        super(props);

    }
    renderNotFoundMessage = () => {
        return (
            <div className='search-results'>
                <h2 className='wiki-article__subtitle'><I18String text='there are no results relevant to the search' format='capitalizeFirst'/></h2>
                <MemoryLink to='/wiki/article/home'><I18String text='go home' format='capitalizeFirst'/></MemoryLink>
            </div>
        )
    }
    render() {
        return (
            <div className='wiki-route'>
                <img className='wiki-background' src={this.props.selectedWiki.background} alt="" />
                <WikiHeader />
                <div className='body--article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'><I18String text='search' format='capitalizeFirst'/>: {this.props.routeParams.articleName}</h1>
                        </div>
                    </div>
                    <div className='search-results'>
                        {this.props.searchResults.map((result) => {
                            return (
                                <div className='search-result'>
                                    <MemoryLink to={`/wiki/article/${result}`}>{result}</MemoryLink>
                                </div>
                            );
                        })}
                        {this.props.searchResults.length === 0 ? this.renderNotFoundMessage() : null}
                    </div>
                </div>
            </div>
        )
    }
}



export default connect<ArticleSearchPageStateProps, ArticleSearchPageDispatchProps, ArticleSearchPageOwnProps, AppState>(
    (state: AppState, props: ArticleSearchPageOwnProps) => {
        return {
            searchResults: getRelevantArticles(props.routeParams.articleName, state.selectedWiki),
            selectedWiki: state.selectedWiki
        }
    },
    {
        fsError
    }
)(ArticleSearchPage);


