import * as React from 'react';
import { MemoryLink } from '../../../../../../libraries/alex components/dist/navigation/memoryRouter';

export class WikiLink extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
    }
    render() {
        if (this.props.active) {
            return (
                <span {...this.props.attributes}>
                    <MemoryLink to={'/wiki/article/' + this.props.to} text={this.props.text ? this.props.text : undefined}>
                        {this.props.children}
                    </MemoryLink>
                </span>

            )
        } else {
            return (
                <span {...this.props.attributes}>
                    <a href=''>
                        {this.props.text}
                        {this.props.children}
                    </a>
                </span>
            );

        }

    }
}


export default WikiLink;