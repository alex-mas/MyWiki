import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '../../../../../libraries/alex components/dist/navigation/memoryRouter';

import HomePage from '../routes/home';
import CreateWikiPage from '../routes/createWiki';
import WikiArticlePage from '../routes/wikiArticle';
import WikiEditPage from '../routes/wikiEdit';
import NotFoundPage from '../routes/notFound';
import CreateArticlePage from '../routes/createArticle';

export type RouteProps = Exclude<MemoryRouteProps, 'history'>;
//Pick<MemoryRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/' singleRoute>
            <MemoryRoute path='/' exact component={HomePage} />
            <MemoryRoute path='/createWiki' exact component={CreateWikiPage} />
            <MemoryRoute path='/wiki/article/:article' exact component={WikiArticlePage} />
            <MemoryRoute path='/wiki/edit/:article' exact component={WikiEditPage} />
            <MemoryRoute path='/wiki/create' exact component={CreateArticlePage}/>
            <MemoryRoute path='' component={NotFoundPage} />
        </Router>
    );
}



export default AppRouter;