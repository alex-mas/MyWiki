import * as React from 'react';
import { MemoryRouteProps, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import WikiHeader from '../components/wikiHeader';


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
                <WikiHeader/>
                <h1 className='page__title'>Not found</h1>
                <h2 className='page__subtitle'>The page you requested couldn't be located</h2>
                <MemoryLink className='page__action' to='/' text='Home'/>
            </div>
        )
    }
}

export default NotFoundPage;