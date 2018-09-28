import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';

import HomePage from '../routes/home';
import { CreateWikiPage } from '../routes/createWiki';
import WikiHomePage from '../routes/wikiHome';

export type RouteProps = Pick<MemoryRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/'>
            <MemoryRoute path='/' exact component={HomePage} />
            <MemoryRoute path='/createWiki' exact component={CreateWikiPage}/>
            <MemoryRoute path='/wiki' exact component={WikiHomePage}/>
        </Router>
    );
}



export default AppRouter;