import * as React from 'react';
import {Link } from 'react-router-dom';
import WikiHeader from '../wikiHeader';
import I18String from '@axc/react-components/i18string';
import AppView  from '../appView';
import { RouteComponentProps } from 'react-router';



interface OwnProps extends RouteComponentProps {

}

export class NotFoundPage extends React.Component<OwnProps, any>{
    constructor(props: OwnProps) {
        super(props);
    }
    componentDidMount() {
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = `MyWiki - Page not found`;
    }
    render() {
        return (
            <AppView>
                <h1 className='page__title'><I18String text='page not found' format='capitalizeFirst' /></h1>
                <h2 className='page__subtitle'><I18String text="the page you requested couldn't be located" format='capitalizeFirst' /></h2>
                <Link className='page__action' to='/'> <I18String text='go home' format='capitalizeFirst' /></Link>
            </AppView>

        )
    }
}

export default NotFoundPage;