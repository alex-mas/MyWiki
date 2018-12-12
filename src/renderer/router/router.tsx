import * as React from 'react';
import Router, { MemoryRoute, withHistoryContext, MemoryRouteProps } from '@axc/react-components/navigation/memoryRouter';

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

export type RouteProps = Exclude<MemoryRouteProps, 'history'>;

interface OwnProps {

}
interface ReduxProps {
    views: PluginView[]
}
type RouterProps = OwnProps & ReduxProps;

export class AppRouter extends React.PureComponent<RouterProps, any>{
    render() {
        return (
            <Router startingRoute='/' singleRoute>
                <MemoryRoute path='/' exact component={HomePage} />
                <MemoryRoute path='/plugins' exact component={() => 'not implementedYet'} />
                <MemoryRoute path='/wiki/plugins' exact component={WikiPluginsPage} />
                <MemoryRoute path='/wiki/edit/:article' exact component={WikiEditPage} />
                <MemoryRoute path='/wiki/create/:article' exact component={CreateArticlePage} />
                <MemoryRoute path='/wiki/article/:article' exact component={WikiArticlePage} />
                <MemoryRoute path='/wiki/search/:articleName' exact component={ArticleSearchPage} />
                <MemoryRoute path='' component={NotFoundPage} />
                {this.props.views.map((view) => {
                    return (
                        <MemoryRoute
                            path={`/pluginView/${view.path}`}
                            exact={view.exact}
                            exactParams={view.exactParams}
                            component={view.component}
                        />
                    );
                })}
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