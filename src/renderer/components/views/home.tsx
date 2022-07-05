import Modal from '@axc/react-components/modal';
import { dialog } from 'electron';
import * as path from 'path';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { loadExternalWiki } from '../../actions/appData';
import { createWiki, loadWiki, selectWiki } from '../../actions/wikis';
import { i18n } from '../../app';
import { AppData } from '../../store/reducers/appData';
import { UserDefinedWikiMetadata, WikiMetadata } from '../../store/reducers/wikis';
import { AppState } from '../../store/store';
import AppView from '../appView';
import { Button } from '../button';
import WikiForm from '../wikiForm';
import Wiki from '../wikiItem';
interface OwnProps extends RouteComponentProps {

}

interface ReduxProps {
  appData: AppData;
  wikis: WikiMetadata[];
  createWiki: typeof createWiki;
  loadWiki: typeof loadWiki;
  loadExternalWiki: typeof loadExternalWiki;
  selectWiki: typeof selectWiki;
}

type ComponentProps = OwnProps & ReduxProps;

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
    const created = this.props.createWiki(metaData).then((created: WikiMetadata) => {
      setTimeout(() => {
        this.props.selectWiki(created.id);
        this.props.history.push(`/wiki/${created.id}`);
      }, 200);
    });

  }
  onImportWiki = () => {
    dialog.showOpenDialog({
      title: i18n('import a wiki'),
      properties: ['openDirectory', 'promptToCreate']
    }).then(({ filePaths }) => {
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
        <div>
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