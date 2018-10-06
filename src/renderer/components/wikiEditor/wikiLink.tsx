import * as React from 'react';
import { MemoryLink } from '../../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { RenderAttributes } from 'slate-react';


export interface WikiLinkProps {
    active: boolean,
    text?: string,
    to: string
    className?: string,
    attributes: RenderAttributes,
    children: React.ReactNode
}

export class WikiLink extends React.Component<WikiLinkProps, any>{
    constructor(props: any) {
        super(props);
    }
    render() {
        if (this.props.active) {
            return (
                <span {...this.props.attributes}>
                    <MemoryLink
                        to={'/wiki/article/' + this.props.to}
                        text={this.props.text ? this.props.text : undefined}
                        className={this.props.className}
                    >
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