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
                <div className='row'>
                    <div className='wiki-home__widget last-edited'>
                        <h2>Last Edited</h2>
                        {this.props.lastEditedArticles.map((a) => {
                            console.log('rendering last edited');
                            return (
                                <div>
                                    {a.name}
                                </div>
                            )
                        })}
                    </div>
                    <div className='wiki-home__widget last-viewed'>
                        <h2>Last Viewed</h2>
                        {this.props.lastViewedArticles.map((a) => {
                            return (
                                <div>
                                    {a.name}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <br/>
                Shortcuts to creating and searching articles of certain categories/tags
                Article of the day
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