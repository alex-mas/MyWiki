import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginOptions } from '../../wikiEditor';
import EditorButton from '../../components/editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../../utilities/blocks';
import { hasInlineType, wrapInline, unwrapInline } from '../../utilities/inlines';
import Modal from '@axc/react-components/dist/layout/modal';
import LinkButton from '../../components/linkButton';
import WikiLink from '../../components/wikiLink';


export const LinkPlugin = (options: EditorPluginOptions) => {

    const renderLink = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        //@ts-ignore
        const href = node.data.get('href');
        //@ts-ignore
        const isOutLink = node.data.get('isOutLink');
        return (
            <WikiLink
                {...props}
                to={href}
                active={options.isReadOnly()}
                isOutLink={isOutLink}
            >
                {children}
            </WikiLink>
        );
    }

    return {
        renderNode: RenderBlock('link', renderLink),
        Button() {
            return (
                <LinkButton {...options} />
            )
        }
    }
}

export default LinkPlugin;