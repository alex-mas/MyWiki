import * as React from 'react';
import Router, { BrowserRoute, withHistoryContext, BrowserRouteProps } from '../../../../../libraries/alex components/dist/navigation/browserRouter';

import HomePage from '../routes/home';
import { CreateWikiPage } from '../routes/createWiki';

export type RouteProps = Pick<BrowserRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/'>
            <BrowserRoute path='/' exact component={HomePage} />
            <BrowserRoute path='/createWiki' exact component={CreateWikiPage}/>
            <BrowserRoute path='/wiki' exact component={()=><div>Test</div>}/>
        </Router>
    );
}



export default AppRouter;