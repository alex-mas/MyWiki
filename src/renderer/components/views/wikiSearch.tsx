import * as React from 'react';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata } from '../../store/reducers/wikis';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import { MemoryLink, MemoryRouteProps } from '@axc/react-components/navigation/memoryRouter';
import { getRelevantArticles } from '../../selectors/articles';
import I18String from '@axc/react-components/display/i18string';
import { Button } from '../button';
import WikiView from '../wikiView';
import { getSelectedWiki } from '../../selectors/wikis';



interface DispatchProps {
    fsError: FsErrorActionCreator
}


interface ReduxProps {
    searchResults: string[],
    selectedWiki: WikiMetadata
}

interface OwnProps extends MemoryRouteProps {
}

type ComponentProps = OwnProps & DispatchProps & ReduxProps;


interface ComponentState {
}

export class ArticleSearchPage extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);

    }
    componentDidMount() {
        //TODO: Fetch descriptions for the search results
    }
    renderNotFoundMessage = () => {
        return (
            <div className='search-results'>
                <h2 className='wiki-article__subtitle'><I18String text='there are no results relevant to the search' format='capitalizeFirst' /></h2>
                <MemoryLink to='/wiki/article/home'><I18String text='go home' format='capitalizeFirst' /></MemoryLink>
            </div>
        )
    }
    render() {
        return (
            <WikiView>
                <div className='body--article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 className='wiki-article__title'><I18String text='search' format='capitalizeFirst' />: {this.props.routeParams.articleName}</h1>
                        </div>
                    </div>
                    <ul className='search-results'>
                        {this.props.searchResults.map((result) => {
                            return (
                                <li className='search-result'>
                                    <div className='search-result__labels'>
                                        <div className='search-result__name'>
                                            {result}
                                        </div>
                                        <div className='search-result__description'>

                                        </div>
                                    </div>
                                    <div className='search-result__actions'>
                                        <Button
                                            btnType='flat'
                                            theme='primary'
                                            className='search-result__action'
                                        >
                                            <MemoryLink
                                                to={`/wiki/article/${result}`}
                                            >
                                                <I18String text='open' format='capitalizeFirst' />
                                            </MemoryLink>
                                        </Button>
                                    </div>

                                </li>
                            );
                        })}
                        {this.props.searchResults.length === 0 ? this.renderNotFoundMessage() : null}
                    </ul>
                </div>

            </WikiView>
        );
    }
}



export default connect(
    (state: AppState, props: OwnProps) => {
        const selectedWiki = getSelectedWiki(state);
        return {
            searchResults: getRelevantArticles(props.routeParams.articleName, selectedWiki),
            selectedWiki
        }
    },
    {
        fsError
    }
)(ArticleSearchPage);


