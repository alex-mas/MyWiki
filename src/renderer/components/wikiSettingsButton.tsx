import * as React from 'react';
import I18String from '@axc/react-components/display/i18string';
import { Modal } from '@axc/react-components/layout/modal';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { WikiMetadata, UserDefinedWikiMetadata } from '../store/reducers/wikis';
import { updateSelectedWikiMetadata } from '../actions/selectedWiki';
import { WikiForm } from './wikiForm';

const root = document.getElementById('app');


interface OwnProps {
    className: string;
}
interface ReduxProps {
    currentWiki: WikiMetadata
    updateSelectedWikiMetadata: typeof updateSelectedWikiMetadata;
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
    onSubmitForm = (metadata: UserDefinedWikiMetadata) => {
        this.props.updateSelectedWikiMetadata(metadata);
        this.toggleForm();
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
        updateSelectedWikiMetadata
    }
)(WikiSettingsButton);