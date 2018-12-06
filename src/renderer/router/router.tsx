import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '@axc/react-components/navigation/memoryRouter';

import HomePage from '../components/views/home';
import WikiArticlePage from '../components/views/wikiArticle';
import WikiEditPage from '../components/views/wikiEdit';
import NotFoundPage from '../components/views/notFound';
import CreateArticlePage from '../components/views/createArticle';
import ArticleSearchPage from '../components/views/wikiSearch';
import WikiPluginsPage from '../components/views/wikiPlugins';

export type RouteProps = Exclude<MemoryRouteProps, 'history'>;



const AppRouter = () => {
    return (
        <Router startingRoute='/' singleRoute>
            <MemoryRoute path='/' exact component={HomePage} />
            <MemoryRoute path='/plugins' exact component={()=>'not implementedYet'}/>
            <MemoryRoute path='/wiki/plugins' exact component={WikiPluginsPage}/>
            <MemoryRoute path='/wiki/edit/:article' exact component={WikiEditPage} />
            <MemoryRoute path='/wiki/create/:article' exact component={CreateArticlePage}/>
            <MemoryRoute path='/wiki/article/:article' exact component={WikiArticlePage} />
            <MemoryRoute path='/wiki/search/:articleName' exact component={ArticleSearchPage}/>
            <MemoryRoute path='' component={NotFoundPage} />
        </Router>
    );
}



export default AppRouter;