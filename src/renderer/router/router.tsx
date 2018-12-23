import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Router, RouteProps, Route, Switch } from 'react-router';
import { MemoryHistory } from '@axc/react-components/memoryHistory';

import HomePage from '../components/views/home';
import WikiArticlePage from '../components/views/wikiArticle';
import WikiEditPage from '../components/views/wikiEdit';
import NotFoundPage from '../components/views/notFound';
import CreateArticlePage from '../components/views/createArticle';
import ArticleSearchPage from '../components/views/wikiSearch';
import WikiPluginsPage from '../components/views/wikiPlugins';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { getPluginViews } from '../selectors/plugins';
import { PluginView } from '../store/reducers/plugins';

export type RouteProps = Exclude<RouteProps, 'history'>;


export const history = createMemoryHistory();

interface OwnProps {
    history: History;
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
                   key='/wiki/plugins'
                        path='/wiki/plugins'
                        exact
                        component={WikiPluginsPage}
                    />
                    <Route
                   key='/wiki/edit/:article'
                        path='/wiki/edit/:article'
                        exact
                        component={WikiEditPage}
                    />
                    <Route
                    key='/wiki/create/:article?'
                        path='/wiki/create/:article?'
                        exact
                        component={CreateArticlePage}
                    />
                    <Route
                    key='/wiki/article/:article'
                        path='/wiki/article/:article'
                        exact
                        component={WikiArticlePage}
                    />
                    <Route
                    key='/wiki/search/:articleName?'
                        path='/wiki/search/:articleName?'
                        exact
                        component={ArticleSearchPage}
                    />
                    {this.props.views.map((view) => {
                        debugger;
                        return (
                            <Route
                            key={`/pluginView/${view.path}`}
                                path={`/pluginView/${view.path}`}
                                exact={view.exact}
                                component={view.component}
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
        return {
            views: getPluginViews(state)
        }
    }
)(AppRouter);