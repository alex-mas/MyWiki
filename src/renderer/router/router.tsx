import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '@axc/react-components/dist/navigation/memoryRouter';

import HomePage from '../routes/home';
import WikiArticlePage from '../routes/wikiArticle';
import WikiEditPage from '../routes/wikiEdit';
import NotFoundPage from '../routes/notFound';
import CreateArticlePage from '../routes/createArticle';
import ArticleSearchPage from '../routes/articleSearch';
import WikiPluginsPage from '../routes/wikiPlugins';
import SettingsPage  from '../routes/settings';

export type RouteProps = Exclude<MemoryRouteProps, 'history'>;
//Pick<MemoryRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/' singleRoute>
            <MemoryRoute path='/' exact component={HomePage} />
            <MemoryRoute path='/wiki/article/:article' exact component={WikiArticlePage} />
            <MemoryRoute path='/wiki/edit/:article' exact component={WikiEditPage} />
            <MemoryRoute path='/wiki/create/:article' exact component={CreateArticlePage}/>
            <MemoryRoute path='/wiki/articleSearch/:articleName' exact component={ArticleSearchPage}/>
            <MemoryRoute path='/wiki/plugins' exact component={WikiPluginsPage}/>
            <MemoryRoute path='/settings' exact component={SettingsPage}/>
            <MemoryRoute path='' component={NotFoundPage} />
        </Router>
    );
}



export default AppRouter;