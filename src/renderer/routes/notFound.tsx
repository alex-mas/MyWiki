import * as React from 'react';

import { MemoryRouteProps, MemoryLink } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';


export interface NotFoundPageProps extends MemoryRouteProps{

}

export class NotFoundPage extends React.Component<NotFoundPageProps, any>{
    constructor(props: NotFoundPageProps) {
        super(props);
    }
    render() {
        return (
            <div>
                <h1>Not found</h1>
                <h2>The page you requested couldn't be located</h2>
                <MemoryLink to='/' text='Home'/>
            </div>
        )
    }
}

export default NotFoundPage;