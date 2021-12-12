import * as React from 'react';
import { Link } from 'react-router-dom';
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
    openOutLink = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const href = this.props.to;
        shell.openExternal(href);
    }
    render() {
        if (this.props.active) {
            if (this.props.isOutLink) {
                //create a link that on click opens a browser with the url providedd. if its http or opens the relevant article if it refers to another wiki.
                return (
                    <span
                        {...this.props.attributes}
                        className='wiki-link'
                    >
                        <a href='' onClick={this.openOutLink} className='wiki-link'>
                            {this.props.text ? this.props.text : null}
                            {this.props.children}
                        </a>
                    </span>
                );
            } else {
                const exists = doesArticleExist(this.props.to, this.props.selectedWiki);
                let to = `/wiki/${this.props.selectedWiki.id}/${exists ? 'article' : 'create'}/${this.props.to}`;
                return (
                    <span
                        className={exists ? 'wiki-link' : 'wiki-link--undone'}
                        {...this.props.attributes}
                    >
                        <Link
                            to={to}
                            className={exists ? 'wiki-link' : 'wiki-link--undone'}
                        >
                            {this.props.text ? this.props.text : null}
                            {this.props.children}
                        </Link>
                    </span>
                );
            }

        } else {
            return (
                <span
                    {...this.props.attributes}
                    className='wiki-link'
                >
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