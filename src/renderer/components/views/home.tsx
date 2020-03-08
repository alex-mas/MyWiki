import * as React from 'react';
import * as path from 'path';
import { AppState } from '../../store/store';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetadata, UserDefinedWikiMetadata } from '../../store/reducers/wikis';
import Wiki from '../wikiItem';
import Modal from '@axc/react-components/modal';
import { AppData } from '../../store/reducers/appData';
import { Button } from '../button';
import { createWiki, loadWiki, LoadWikiActionCreator, selectWiki } from '../../actions/wikis';
import WikiForm from '../wikiForm';
import AppView from '../appView';
import { RouteComponentProps } from 'react-router';
import { remote, Dialog } from 'electron';
import { i18n } from '../../app';
import { loadExternalWiki } from '../../actions/appData';
const dialog: Dialog = remote.dialog;
interface OwnProps extends RouteComponentProps{

}

interface ReduxProps {
    appData: AppData;
    wikis: WikiMetadata[];
    createWiki: typeof createWiki;
    loadWiki: typeof loadWiki;
    loadExternalWiki: typeof loadExternalWiki;
    selectWiki: typeof selectWiki;
}

type ComponentProps =  OwnProps & ReduxProps;

interface ComponentState {
    shouldRenderWikiForm: boolean;
}

export class HomePage extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            shouldRenderWikiForm: false
        }
    }
    toggleWikiForm = () => {
        this.setState((prevState) => ({
            shouldRenderWikiForm: !prevState.shouldRenderWikiForm
        }));
    }
    createWiki = (metaData: UserDefinedWikiMetadata) => {
        event.preventDefault();
        this.toggleWikiForm();
        //@ts-ignore
        const created = this.props.createWiki(metaData).then((created: WikiMetadata)=>{
            setTimeout(()=>{
                this.props.selectWiki(created.id);
                this.props.history.push(`/wiki/${created.id}`);
            },200);
        });
    
    }
    onImportWiki = ()=>{
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: i18n('import a wiki'),
            properties: ['openDirectory','promptToCreate']
        },
            (filePaths: string[]) => {
                if (filePaths.length === 1) {
                    const wikiPath = path.resolve(__dirname, filePaths[0]);
                    this.props.loadWiki(undefined, wikiPath);
                    this.props.loadExternalWiki(wikiPath);
                }
            });
    }
    render() {
        return (
            <AppView
                title='MyWiki - Home'
            >
                <div className='body'>
                    <ul className='wiki-list'>
                        {this.props.wikis.map((wiki) => {
                            return <Wiki key={wiki.id} wiki={wiki} />
                        })}
                        <div key='wiki-list__actions' className='wiki-list__actions'>
                            <Button
                                btnType='solid'
                                theme='primary'
                                className='wiki-list__action--primary'
                                onClick={this.toggleWikiForm}
                            >
                                <i className='material-icons'>add</i>
                            </Button>
                            <Button
                                btnType='flat'
                                theme='primary'
                                className='wiki-list__action--secondary'
                                onClick={this.onImportWiki}
                            >
                                <i className='material-icons'>archive</i>
                            </Button>
                        </div>
                    </ul>
                    <Modal
                        isOpen={this.state.shouldRenderWikiForm}
                        onClose={this.toggleWikiForm}
                        className='modal'
                    >
                        <WikiForm
                            onClose={this.toggleWikiForm}
                            onSubmit={this.createWiki}
                        />
                    </Modal>
                </div>
            </AppView>
        );
    }
}


export default connect(
    (state: AppState, props: OwnProps) => {
        return {
            wikis: state.wikis,
            appData: state.appData
        } as ReduxProps
    },
    {
        createWiki,
        loadWiki,
        loadExternalWiki,
        selectWiki
    }
)(HomePage);