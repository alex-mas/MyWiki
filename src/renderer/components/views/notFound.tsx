import * as React from 'react';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import WikiHeader from '../wikiHeader';
import I18String from '@axc/react-components/display/i18string';
import AppView  from '../appView';


export interface NotFoundPageProps extends MemoryRouteProps {

}

export class NotFoundPage extends React.Component<NotFoundPageProps, any>{
    constructor(props: NotFoundPageProps) {
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
                <MemoryLink className='page__action' to='/'> <I18String text='go home' format='capitalizeFirst' /></MemoryLink>
            </AppView>

        )
    }
}

export default NotFoundPage;