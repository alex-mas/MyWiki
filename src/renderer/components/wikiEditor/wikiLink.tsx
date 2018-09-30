import * as React from 'react';
import { MemoryLink } from '../../../../../../libraries/alex components/dist/navigation/memoryRouter';

export class WikiLink extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        debugger;
    }
    render() {
        return (
            <span {...this.props.attributes}>
                <MemoryLink to={'/wiki/'+this.props.to} text={this.props.text ? this.props.text : undefined}>
                    {this.props.children}
                </MemoryLink>
            </span>

        )
    }
}


export default WikiLink;