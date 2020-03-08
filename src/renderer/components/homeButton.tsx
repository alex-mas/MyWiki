import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

class _HomeButton extends React.Component<any, any>{
    navigateToHome = ()=>{
        this.props.history.push('/');
    }
    render() {
        return (
            <button
                onClick={this.navigateToHome}
                className='wiki-header__action--secondary'
            >
                  <i className='icon-btn--secondary material-icons'>home</i>
            </button>
        )

    }
}

export const HomeButton = withRouter(_HomeButton);
export default HomeButton;    