import * as React from 'react';
import I18String from '@axc/react-components/i18string';
import { Modal } from '@axc/react-components/modal';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { WikiMetadata, UserDefinedWikiMetadata } from '../store/reducers/wikis';
import { updateWikiMetadata } from '../actions/wikis';
import { WikiForm } from './wikiForm';
import { getSelectedWiki, getWikiById } from '../selectors/wikis';
import { withRouter, RouteComponentProps } from 'react-router';
import { RouteProps } from '../router';

const root = document.getElementById('app');


interface OwnProps {
    className: string;
}
interface ReduxProps {
    currentWiki: WikiMetadata
    updateWikiMetadata: typeof updateWikiMetadata;
}

type ComponentProps = OwnProps & ReduxProps;

export class WikiSettingsButton extends React.Component<ComponentProps, { isFormOpen: boolean }>{
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
        this.props.updateWikiMetadata('',metadata);
        this.toggleForm();
    }
    render() {
        return (
            <React.Fragment>
                <a
                    className={this.props.className}
                    onClick={this.toggleForm}
                >
                    <i className='icon-btn--secondary material-icons'>
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
            currentWiki: getSelectedWiki(state)
        }
    },
    {
        updateWikiMetadata
    }
)(WikiSettingsButton);