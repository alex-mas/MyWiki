import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const BlockQuotePlugin = (context: EditorPluginContext) => {

    const renderBlockQuote = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        return (
            <blockquote {...attributes} className='wiki-editor__block-quote'>
                {children}
            </blockquote>
        );
    }
    const onClickButton = onClickBlockButton(context);

    const type = 'block quote';
    return {
        id: 'block_quote_plugin',
        renderNode: RenderBlock(type, renderBlockQuote),
        Button() {
            const isActive = hasBlockType(context.getContent(), type);
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'format_quote'}
                    type={type}
                />
            );
        }
    }
}

export default BlockQuotePlugin;