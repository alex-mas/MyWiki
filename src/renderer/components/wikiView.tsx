import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { AppState } from '../store/store';
import { connect } from 'react-redux';
import WikiHeader from '../components/wikiHeader';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki, getWikiById } from '../selectors/wikis';
import Notifications from './notifications';
import { HomeButton } from './homeButton';
import PageActions from './pageActions';
import WikiMenu from './wikiMenu';
import { RouterProps, withRouter, RouteComponentProps } from 'react-router';





type OwnProps = {
    background?: string,
    title: string
} & RouteComponentProps<{ id: string }>;

interface ReduxProps {
    selectedWiki: WikiMetadata
}


export type ComponentProps = OwnProps & ReduxProps;

interface ComponentState {
    isMenuOpen: boolean,
}


export class WikiView extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            isMenuOpen: false
        }
    }
    createWiki = () => {
        this.props.history.push(`/wiki/${this.props.match.params.id}/create/`);
    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = this.props.title;
    }
    getBackground = () => {
        let background;
        if (this.props.background) {
            background = this.props.background;
        } else if (this.props.selectedWiki.background) {
            background = this.props.selectedWiki.background;
        } else {
            //fallback
        }
        return background;
    }
    onToggleHeaderMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState((prevState) => ({
            isMenuOpen: !prevState.isMenuOpen
        }));
    }
    closeMenu = () => {
        this.setState((prevState) => ({
            isMenuOpen: false
        }));
    }
    render() {
        return (
            <>
                <div className='route'>
                    <WikiHeader>
                        <button
                            type='button'
                            onClick={this.createWiki}
                            className='page-action button-flat--primary'
                        >
                            <i className='btn--secondary material-icons'>
                                add
                                </i>
                        </button>
                        <button
                            type='button'
                            className='page-action button-flat--primary'
                            onClick={this.onToggleHeaderMenu}
                        >
                            <i className='btn--secondary material-icons'>
                                menu
                                </i>
                        </button>
                        <WikiMenu
                            isOpen={this.state.isMenuOpen}
                            onClose={this.closeMenu}
                        />
                    </WikiHeader>
                    <img className='route__background' src={this.getBackground()} alt="background" />
                    {this.props.children}
                </div>
            </>
        )
    }
}




export default withRouter(connect((state: AppState, props: OwnProps) => {
    return {
        selectedWiki: getWikiById(state, props.match.params.id)
    };
})(WikiView));