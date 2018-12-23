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
        return (
            <Router history={history}>
                <Switch>
                    <Route path='/' exact component={HomePage} />
                    <Route path='/plugins' exact render={() => 'not implementedYet'} />
                    <Route path='/wiki/plugins' exact component={WikiPluginsPage} />
                    <Route path='/wiki/edit/:article' exact component={WikiEditPage} />
                    <Route path='/wiki/create/:article?' exact component={CreateArticlePage} />
                    <Route path='/wiki/article/:article' exact component={WikiArticlePage} />
                    <Route path='/wiki/search/:articleName?' exact component={ArticleSearchPage} />
                    <Route path='' component={NotFoundPage} />
                    {this.props.views.map((view) => {
                        return (
                            <Route
                                path={`/pluginView/${view.path}`}
                                exact={view.exact}
                                exactParams={view.exactParams}
                                component={view.component}
                            />
                        );
                    })}
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