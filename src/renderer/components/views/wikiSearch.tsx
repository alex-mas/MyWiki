import * as React from 'react';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata } from '../../store/reducers/wikis';
import { fsError, FsErrorActionCreator } from '../../actions/errors';
import { Link} from 'react-router-dom';
import { getRelevantArticles } from '../../selectors/articles';
import I18String from '@axc/react-components/i18string';
import { Button } from '../button';
import WikiView from '../wikiView';
import { getSelectedWiki, getWikiById } from '../../selectors/wikis';
import { RouteComponentProps } from 'react-router';



interface DispatchProps {
    fsError: FsErrorActionCreator
}


interface ReduxProps {
    searchResults: string[],
    selectedWiki: WikiMetadata
}

interface OwnProps extends RouteComponentProps<{articleName: string, id:string}> {
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
                <Link to={`/wiki${this.props.match.params.id}/article/home`}><I18String text='go home' format='capitalizeFirst' /></Link>
            </div>
        )
    }
    render() {
        return (
            <WikiView title={`${this.props.selectedWiki.name}@search - ${this.props.match.params.articleName}`}>
                <div className='wiki-article'>
                    <div className='wiki-article__header'>
                        <div className='wiki-article__header__section'>
                            <h1 
                            className='wiki-article__title'
                            >
                            <I18String 
                            text='search' 
                            format='capitalizeFirst' 
                            />
                            : 
                            {this.props.match.params.articleName}
                            </h1>
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
                                            <Link
                                                to={`/wiki/${this.props.match.params.id}/article/${result}`}
                                            >
                                                <I18String text='open' format='capitalizeFirst' />
                                            </Link>
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
        const selectedWiki = getWikiById(state, props.match.params.id);
        return {
            searchResults: getRelevantArticles(selectedWiki,props.match.params.articleName),
            selectedWiki
        }
    },
    {
        fsError
    }
    //@ts-ignore
)(ArticleSearchPage);


