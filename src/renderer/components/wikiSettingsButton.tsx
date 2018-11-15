import * as React from 'react';
import I18String from '@axc/react-components/display/i18string';
import { Modal } from '@axc/react-components/layout/modal';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { WikiMetaData } from '../store/reducers/wikis';
import { updateCurrentWikiMetadata, UpdateWikiMetadataPayload } from '../actions/selectedWiki';
import { WikiForm } from './wikiForm';

const root = document.getElementById('app');


interface OwnProps {
    className: string;
}
interface ReduxProps {
    currentWiki: WikiMetaData
    updateCurrentWikiMetadata: typeof updateCurrentWikiMetadata;
}
type ButtonProps = OwnProps & ReduxProps;

export class WikiSettingsButton extends React.Component<ButtonProps, { isFormOpen: boolean }>{
    constructor(props: any) {
        super(props);
        this.state = {
            isFormOpen: false
        };
    }
    toggleForm = () => {
        this.setState((prevState) => ({
            isFormOpen: !prevState.isFormOpen
        }));
    }
    onSubmitForm = (metadata: UpdateWikiMetadataPayload) => {
        this.props.updateCurrentWikiMetadata(metadata);
    }
    render() {
        return (
            <React.Fragment>
                <a
                    className={this.props.className}
                    onClick={this.toggleForm}
                >
                    <i className='material-icons'>
                        settings
                    </i>
                    <I18String text='settings' />
                </a>
                <Modal
                    onClose={this.toggleForm}
                    isOpen={this.state.isFormOpen}
                    root={root}
                    className='modal'
                >
                    <WikiForm
                        initialValues={this.props.currentWiki}
                        onSubmit={this.onSubmitForm}
                        onClose={this.toggleForm}
                    />
                </Modal>
            </React.Fragment>
        )
    }
}


export default connect(
    (state: AppState, props: OwnProps) => {
        return {
            currentWiki: state.selectedWiki
        }
    },
    {
        updateCurrentWikiMetadata
    }
)(WikiSettingsButton);