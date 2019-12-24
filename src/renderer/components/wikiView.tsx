import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { AppState } from '../store/store';
import { connect } from 'react-redux';
import WikiHeader from '../components/wikiHeader';
import { WikiMetadata } from '../store/reducers/wikis';
import { getSelectedWiki } from '../selectors/wikis';
import Notifications from './notifications';
import { HomeButton } from './homeButton';
import PageActions from './pageActions';
import WikiMenu from './wikiMenu';
import { RouterProps, withRouter, RouteComponentProps } from 'react-router';





interface OwnProps {
    background?: string,
    title: string
}

interface ReduxProps {
    selectedWiki: WikiMetadata
}


export type ComponentProps = OwnProps & ReduxProps & RouteComponentProps;

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
    createWiki = ()=>{
        this.props.history.push('/wiki/create/');
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
    render() {
        return (
            <div className='route'>
                <img className='route__background' src={this.getBackground()} alt="background" />
                {this.props.children}
                <PageActions>
                    <button
                        type='button'
                        onClick={this.createWiki}
                        className='page-action button-flat--secondary'
                    >
                        <i className='material-icons'>
                            add
                        </i>
                    </button>
                    <button
                        type='button'
                        className='page-action button-flat--secondary'
                        onClick={this.onToggleHeaderMenu}
                    >
                        <i className='material-icons'>
                            menu
                        </i>
                    </button>
                    <WikiMenu
                        isOpen={this.state.isMenuOpen}
                    />
                </PageActions>
            </div>
        )
    }
}




export default connect((state: AppState, props) => {
    return {
        selectedWiki: getSelectedWiki(state)
    };
})(withRouter(WikiView));