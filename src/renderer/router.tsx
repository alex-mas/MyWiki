import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Router, RouteProps as R, Route, Switch } from 'react-router';
import { MemoryHistory } from '@axc/react-components/memoryHistory';

import HomePage from './components/views/home';
import WikiArticlePage from './components/views/wikiArticle';
import WikiEditPage from './components/views/wikiEdit';
import NotFoundPage from './components/views/notFound';
import CreateArticlePage from './components/views/createArticle';
import ArticleSearchPage from './components/views/wikiSearch';
import WikiPluginsPage from './components/views/wikiPlugins';
import { connect } from 'react-redux';
import { AppState } from './store/store';
import { getPluginViews } from './selectors/plugins';
import { PluginView } from './store/reducers/plugins';
import WikiView  from './components/wikiView';
import WikiHomePage from './components/views/wikiHomePage';

export type RouteProps = Exclude<R, 'history'>;


export const history = createMemoryHistory();

interface OwnProps {

}
interface ReduxProps {
    views: PluginView[]
}
type RouterProps = OwnProps & ReduxProps;

export class AppRouter extends React.PureComponent<RouterProps, any>{
    render() {
        console.log(history.location);
        return (
            <Router history={history}>
                <Switch>
                    <Route
                        key='/'
                        path='/'
                        exact
                        component={HomePage}
                    />
                    <Route
                        key='/plugins'
                        path='/plugins'
                        exact
                        render={() => 'not implementedYet'}
                    />
                    <Route
                        key='/wiki/:id'
                        path='/wiki/:id'
                        exact
                        component={WikiHomePage}
                    />
                    <Route
                        key='/wiki/:id/plugins'
                        path='/wiki/:id/plugins'
                        exact
                        component={WikiPluginsPage}
                    />
                    <Route
                        key='/wiki/:id/edit/:article'
                        path='/wiki/:id/edit/:article'
                        exact
                        component={WikiEditPage}
                    />
                    <Route
                        key='/wiki/:id/create/:article?'
                        path='/wiki/:id/create/:article?'
                        exact
                        component={CreateArticlePage}
                    />
                    <Route
                        key='/wiki/:id/article/:article'
                        path='/wiki/:id/article/:article'
                        exact
                        component={WikiArticlePage}
                    />
                    <Route
                        key='/wiki/:id/search/:articleName?'
                        path='/wiki/:id/search/:articleName?'
                        exact
                        component={ArticleSearchPage}
                    />
                    {this.props.views.map((view) => {
                        console.log("re rendering plugin views");
                        return (
                            <Route
                                key={`/pluginView/${view.path}`}
                                path={`/pluginView/${view.path}`}
                                exact={view.exact}
                                component={(props: any)=><WikiView title='@pluginView'><view.component {...props}/></WikiView>}
                            />
                        );
                    })}
                    <Route
                        path=''
                        component={NotFoundPage}
                    />
                </Switch>
            </Router>
        )

    }
}


export default connect(
    (state: AppState, props: OwnProps) => {
        //TOODO: Make getPluginViews memoized to prevent re-renderings
        return {
            views: getPluginViews(state)
        }
    }
)(AppRouter);