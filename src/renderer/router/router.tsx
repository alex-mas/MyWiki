import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '@axc/react-components/navigation/memoryRouter';

import HomePage from '../views/home/index';
import WikiArticlePage from '../views/wikiArticle/index';
import WikiEditPage from '../views/wikiEdit/index';
import NotFoundPage from '../views/notFound/index';
import CreateArticlePage from '../views/createArticle/index';
import ArticleSearchPage from '../views/search/index';
import WikiPluginsPage from '../views/wikiPlugins/index';
import WikiSettingsPage from '../views/wikiSettings/index';

export type RouteProps = Exclude<MemoryRouteProps, 'history'>;
//Pick<MemoryRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/' singleRoute>
            <MemoryRoute path='/' exact component={HomePage} />
            <MemoryRoute path='/wiki/article/:article' exact component={WikiArticlePage} />
            <MemoryRoute path='/wiki/edit/:article' exact component={WikiEditPage} />
            <MemoryRoute path='/wiki/create/:article' exact component={CreateArticlePage}/>
            <MemoryRoute path='/wiki/search/:articleName' exact component={ArticleSearchPage}/>
            <MemoryRoute path='/wiki/plugins' exact component={WikiPluginsPage}/>
            <MemoryRoute path='/wiki/settings' exact component={WikiSettingsPage}/>
            <MemoryRoute path='' component={NotFoundPage} />
        </Router>
    );
}



export default AppRouter;