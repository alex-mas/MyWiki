import * as React from 'react';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import { RenderAttributes } from 'slate-react';
import {doesArticleExist} from '../../../selectors/articles';
import {connect} from 'react-redux';
import { AppState } from '../../../store/store';
import { WikiMetaData } from '../../../store/reducers/wikis';




export interface WikiLinkOwnProps {
    active: boolean,
    text?: string,
    to: string
    className?: string,
    attributes: RenderAttributes,
    children: React.ReactNode,
    isOutLink: boolean
}


export interface WikiLinkStateProps{ 
    selectedWiki: WikiMetaData
}

export type WikiLinkProps = WikiLinkOwnProps & WikiLinkStateProps;

export class WikiLink extends React.Component<WikiLinkProps, any>{
    constructor(props: any) {
        super(props);
    }
    render() {
        if (this.props.active) {
            if (this.props.isOutLink) {
                //create a link that on click opens a browser with the url providedd. if its http or opens the relevant article if it refers to another wiki.
            } else {
                const exists = doesArticleExist(this.props.to, this.props.selectedWiki);
                let to = `/wiki/${exists ? 'article' : 'create'}/${this.props.to}`
                return (
                    <span {...this.props.attributes}>
                        <MemoryLink
                            to={to}
                            text={this.props.text ? this.props.text : undefined}
                            className={exists ? 'wiki-link' :'wiki-link--undone'}
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


export default connect((state: AppState,props:WikiLinkOwnProps)=>{
    return{
        selectedWiki: state.selectedWiki
    }
},undefined)(WikiLink);