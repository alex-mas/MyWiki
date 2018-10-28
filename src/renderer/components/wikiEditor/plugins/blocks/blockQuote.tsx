import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginOptions } from '../../wikiEditor';
import EditorButton from '../../editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../../utilities/blocks';



export const BlockQuotePlugin = (options: EditorPluginOptions) => {

    const renderBlockQuote = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        return (
            <blockquote {...attributes} className='wiki-block-quote'>
                {children}
            </blockquote>
        );
    }
    const onClickButton = onClickBlockButton(options.getContent, options.onChange);

    const type = 'block quote';
    return {
        renderNode: RenderBlock(type, renderBlockQuote),
        Button() {
            const isActive = hasBlockType(options.getContent(), type);
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