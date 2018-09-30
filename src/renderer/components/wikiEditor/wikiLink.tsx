import * as React from 'react';
import { MemoryLink } from '../../../../../../libraries/alex components/dist/navigation/memoryRouter';

export class WikiLink extends React.Component<any,any>{
    constructor(props:any){
        super(props);
    }
    render(){
        return(
            <MemoryLink to={this.props.to} text={this.props.text? this.props.text : undefined}>
                {this.props.children}
            </MemoryLink>
        )
    }
}


export default WikiLink;