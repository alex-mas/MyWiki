import * as React from 'react';
import Router, { BrowserRoute, WithHistoryContext, BrowserRouteProps } from '../../../../../libraries/alex components/dist/navigation/browserRouter';

import HomePage from '../routes/home';
import { CreateWikiPage } from '../routes/createWiki';

export type RouteProps = Pick<BrowserRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/'>
            <BrowserRoute path='/' exact component={HomePage} />
            <BrowserRoute path='/createWiki' exact component={CreateWikiPage}/>
        </Router>
    );
}



export default AppRouter;