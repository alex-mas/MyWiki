import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, Editor } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { hasInlineType, wrapInline, unwrapInline } from '../utilities/inlines';
import Modal from '@axc/react-components/layout/modal';
import LinkButton from '../components/linkButton';
import WikiLink from '../components/wikiLink';


export const wrapLink = (editor: Editor, href: string, isOutLink: boolean = false) => {
    editor.wrapInline({
        type: 'link',
        data: { href, isOutLink }
    });
    editor.moveToEnd()
}



export const unwrapLink = (editor: Editor) => {
    editor.unwrapInline('link')
}

export const LinkPlugin = (context: EditorPluginContext) => {

    const renderLink = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        const href = node.data.get('href');
        const isOutLink = node.data.get('isOutLink');
        return (
            <WikiLink
                {...props}
                to={href}
                active={context.isReadOnly()}
                isOutLink={isOutLink}
            >
                {children}
            </WikiLink>
        );
    }

    return {
        id: 'link_plugin',
        renderNode: RenderBlock('link', renderLink),
        Button() {
            return (
                <LinkButton
                    {...context}
                />
            )
        }
    }
}

export default LinkPlugin;