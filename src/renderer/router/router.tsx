import * as React from 'react';
import Router, { BrowserRoute, WithHistoryContext, BrowserRouteProps } from '../../../../../libraries/alex components/dist/navigation/browserRouter';

import HomePage from '../routes/home';

export type RouteProps = Pick<BrowserRouteProps, "path" | "exact" | "children" | "component">;


const AppRouter = () => {
    return (
        <Router startingRoute='/'>
            <BrowserRoute path='/' exact={false} component={HomePage} />
        </Router>
    );
}



export default AppRouter;