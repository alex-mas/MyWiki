import * as React from 'react';

import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';
import AppHeader from '../components/appHeader';


export interface NotFoundPageProps extends MemoryRouteProps{

}

export class NotFoundPage extends React.Component<NotFoundPageProps, any>{
    constructor(props: NotFoundPageProps) {
        super(props);
    }
    componentDidMount(){
        const appTitle = document.getElementById('pageTitle');
        appTitle.innerText = `MyWiki - Page not found`;
    }
    render() {
        return (
            <div className='wiki-route'>
                <AppHeader/>
                <h1 className='page__title'>Not found</h1>
                <h2 className='page__subtitle'>The page you requested couldn't be located</h2>
                <MemoryLink className='page__action' to='/' text='Home'/>
            </div>
        )
    }
}

export default NotFoundPage;