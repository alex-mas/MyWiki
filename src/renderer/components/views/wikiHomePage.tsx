import * as React from 'react';
import * as path from 'path';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata, UserDefinedWikiMetadata } from '../../store/reducers/wikis';
import Wiki from '../wikiItem';
import Modal from '@axc/react-components/modal';
import { AppData } from '../../store/reducers/appData';
import { Button } from '../button';
import { createWiki, loadWiki, LoadWikiActionCreator } from '../../actions/wikis';
import WikiForm from '../wikiForm';
import AppView from '../appView';
import { RouteComponentProps } from 'react-router';
import { remote, Dialog } from 'electron';
import { i18n } from '../../app';
import { loadExternalWiki } from '../../actions/appData';
import WikiView from '../wikiView';
import { getSelectedWiki, getWikiById } from '../../selectors/wikis';
import { ArticleMetaData } from '../../actions/article';
import { getLastViewedArticles, getLastEditedArticles } from '../../selectors/articles';
import WikiSearchBar from '../wikiSearchBar';
import { Link } from 'react-router-dom';
const dialog: Dialog = remote.dialog;
interface OwnProps extends RouteComponentProps<{ id: string }> {

}

interface ReduxProps {
    selectedWiki: WikiMetadata,
    lastEditedArticles: ArticleMetaData[],
    lastViewedArticles: ArticleMetaData[]
}

type ComponentProps = OwnProps & ReduxProps;

interface ComponentState {
    shouldRenderWikiForm: boolean;
}

export class WikiHomePage extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
    }
    render() {
        return (
            <WikiView
                title='MyWiki - Home'
            >
                <div className='wiki-article' key='body'>
                    <div className='wiki-article__header' key='dashboard-info'>
                        <div className='wiki-article__searchbar'>
                            <WikiSearchBar />
                        </div>
                    </div>
                    <div className='wiki-article__body'>
                        <div className='row wiki-home__widgets' key='dashboard-info'>
                            <div className='wiki-home__widget last-edited' key='last-edited'>
                                <h2 className='last-edited__title'>Last Edited</h2>
                                {this.props.lastEditedArticles.map((a) => {
                                    return (
                                        <div className='wiki-home__link'>
                                            <Link to={`/wiki/${this.props.match.params.id}/article/${a.name}`} key={a.name}> {a.name}</Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='wiki-home__widget last-viewed' key='last-viewed'>
                                <h2 className='last-edited__title'>Last Viewed</h2>
                                {this.props.lastViewedArticles.map((a) => {
                                    return (
                                        <div className='wiki-home__link'>
                                            <Link to={`/wiki/${this.props.match.params.id}/article/${a.name}`} key={a.name}> {a.name}</Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </WikiView>
        );
    }
}


export default connect(
    (state: AppState, props: OwnProps) => {
        const selectedWiki = getWikiById(state, props.match.params.id);
        return {
            selectedWiki,
            lastViewedArticles: getLastViewedArticles(selectedWiki),
            lastEditedArticles: getLastEditedArticles(selectedWiki)
        }
    },
    {
    }
)(WikiHomePage);