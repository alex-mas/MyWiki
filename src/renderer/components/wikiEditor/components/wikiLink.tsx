import * as React from 'react';
import { MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import { RenderAttributes } from 'slate-react';
import { doesArticleExist } from '../../../selectors/articles';
import { connect } from 'react-redux';
import { AppState } from '../../../store/store';
import { WikiMetadata } from '../../../store/reducers/wikis';
import { shell } from 'electron';
import { getSelectedWiki } from '../../../selectors/wikis';



interface OwnProps {
    active: boolean,
    text?: string,
    to: string
    className?: string,
    attributes: RenderAttributes,
    children: React.ReactNode,
    isOutLink: boolean
}


interface ReduxProps {
    selectedWiki: WikiMetadata
}

type ComponentProps = OwnProps & ReduxProps;

export class WikiLink extends React.Component<ComponentProps, any>{
    constructor(props: any) {
        super(props);
    }
    openOutLink = () => {
        const href = this.props.to;
        shell.openExternal(href);
    }
    render() {
        if (this.props.active) {
            if (this.props.isOutLink) {
                //create a link that on click opens a browser with the url providedd. if its http or opens the relevant article if it refers to another wiki.
                return (
                    <span onClick={this.openOutLink}{...this.props.attributes}>
                        <a href=''>
                            {this.props.text}
                            {this.props.children}
                        </a>
                    </span>
                );
            } else {
                const exists = doesArticleExist(this.props.to, this.props.selectedWiki);
                let to = `/wiki/${exists ? 'article' : 'create'}/${this.props.to}`
                return (
                    <span {...this.props.attributes}>
                        <MemoryLink
                            to={to}
                            text={this.props.text ? this.props.text : undefined}
                            className={exists ? 'wiki-link' : 'wiki-link--undone'}
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


export default connect((state: AppState, props: OwnProps) => {
    return {
        selectedWiki: getSelectedWiki(state)
    }
}, undefined)(WikiLink);