import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

class _HomeButton extends React.Component<any, any>{
    navigateToHome = ()=>{
        this.props.history.push('/');
    }
    render() {
        let className = 'button-flat--secondary';
        if(this.props.className){
            className += ' '+ this.props.className;
        }
        return (
            <button
                onClick={this.navigateToHome}
                className={className}
            >
                  <i className='material-icons'>home</i>
            </button>
        )

    }
}

export const HomeButton = withRouter(_HomeButton);
export default HomeButton;