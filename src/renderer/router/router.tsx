import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';

import HomePage from '../routes/home';
import { CreateWikiPage } from '../routes/createWiki';
import WikiArticlePage from '../routes/wikiArticle';

export type RouteProps = Exclude<MemoryRouteProps, 'history'>;
//Pick<MemoryRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/'>
            <MemoryRoute path='/' exact component={HomePage} />
            <MemoryRoute path='/createWiki' exact component={CreateWikiPage}/>
            <MemoryRoute path='/wiki/:article' exact component={WikiArticlePage}/>
        </Router>
    );
}



export default AppRouter;