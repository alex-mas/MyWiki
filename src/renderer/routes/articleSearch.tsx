import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { RouteProps } from '../router/router';
import { AppState } from '../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';
import WikiEditor, { defaultEditorContents } from '../components/wikiEditor/wikiEditor';
import { Change, Value } from 'slate';
import { fsError, FsErrorActionCreator } from '../actions/errors';
import Header from '../components/header';
import { MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { getRelevantArticles } from '../selectors/articles';


export interface ArticleSearchPageDispatchProps {
    fsError: FsErrorActionCreator
}


export interface ArticleSearchPageStateProps {
    searchResults: string[]
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
    render() {
        return (
            <div className='wiki-route'>
                <Header>
                    <i className='wiki-header__icon'>placeholder</i>
                    <MemoryLink to={`/wiki/create/${this.props.routeParams.articleName}`}> Create Article</MemoryLink>
                </Header>
                <div className='body--article'>
                    <h1 className='wiki-article__title'>{this.props.routeParams.articleName}</h1>
                    <div className='search-results'>
                        {this.props.searchResults.map((result) => {
                            return (
                                <div className='search-result'>
                                    <MemoryLink to={`/wiki/article/${result}`}>{result}</MemoryLink>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }
}



export default connect<ArticleSearchPageStateProps, ArticleSearchPageDispatchProps, ArticleSearchPageOwnProps, AppState>(
    (state: AppState, props: ArticleSearchPageOwnProps) => {
        return {
            searchResults: getRelevantArticles(props.routeParams.articleName, state.selectedWiki)
        }
    },
    {
        fsError
    }
)(ArticleSearchPage);


