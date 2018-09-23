import * as React from 'react';
import Router, { BrowserRoute, BrowserHistory, WithHistoryContext } from '../../../../../libraries/alex components/dist/navigation/browserRouter';



export interface MyRouteProps {
    history: BrowserHistory,
    path: string,
    exact: boolean
}

const _MyRoute: React.SFC<MyRouteProps> = (props: MyRouteProps) => {
    return (
        <div>Hello World</div>
    );
}

const myHoc = (Comp: any): React.SFC<any> => {
    return (props: any) => (
        <Comp {...props} />
    );
}

const MyRoute = WithHistoryContext(_MyRoute);


const MyTest = myHoc(_MyRoute);


const AppRouter = () => {
    return (
        <Router startingRoute='/test'>
            <MyRoute path='/' exact />
            <BrowserRoute path='/' exact={false} component={MyRoute} />
            <MyTest path='/' exact={false}/>
        </Router>
    )
}



export default AppRouter;