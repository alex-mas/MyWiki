import * as React from 'react';
import { RouteProps } from '../router/router';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { WikiMetaData } from '../store/reducers/wikis';



export interface WikiProps{
    wiki: WikiMetaData
}

class Wiki extends React.Component<WikiProps>{
    constructor(props: WikiProps){
        super(props);
    }
    render(){
        return(
            <div>
                {this.props.wiki.name} 
                <button>Open</button>
                <button>Untrack</button>
            </div>
        );
    }
}

const mapDispatchToProps: MapDispatchToProps<{}, WikiProps> = (dispatch, props)=>{
    return{

    };
}

export default connect(undefined,mapDispatchToProps)(Wiki);