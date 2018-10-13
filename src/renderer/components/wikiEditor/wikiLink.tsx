import * as React from 'react';
import { MemoryLink } from '../../../../../../libraries/alex components/dist/navigation/memoryRouter';
import { RenderAttributes } from 'slate-react';


export interface WikiLinkProps {
    active: boolean,
    text?: string,
    to: string
    className?: string,
    attributes: RenderAttributes,
    children: React.ReactNode,
    isOutLink: boolean
}

export class WikiLink extends React.Component<WikiLinkProps, any>{
    constructor(props: any) {
        super(props);
    }
    render() {
        if (this.props.active) {
            if (this.props.isOutLink) {
                //create a link that on click opens a browser with the url providedd. if its http or opens the relevant article if it refers to another wiki.
            } else {
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
                );
            }

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