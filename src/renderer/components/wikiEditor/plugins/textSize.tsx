import * as React from 'react';
import { RenderMarkProps, RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton, toggleMark } from '../utilities/marks';
import { Value, Editor } from 'slate';
import { ColorPickerButton } from '../components/colorPickerButton';
import { RenderBlock } from '../utilities/blocks';
import { hasInlineType } from '../utilities/inlines';



export const TextSizePlugin = (context: EditorPluginContext) => {

    const renderSizedText = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        return (
            <span
                {...attributes}
                style={{ fontSize: node.data.get("size") }}
                className='wiki-sized-text'
            >
                {children}
            </span>
        );
    }
    return {
        id: 'sized-text_plugin',
        renderNode: RenderBlock('sized-text', renderSizedText),
        Button() {
            const isActive = hasInlineType(context.getContent(), 'sized-text');
            return (
                <ColorPickerButton
                    active={isActive}
                    icon='border_color'
                    type='sized-text'
                    context={context}
                />
            )
        }
    }
}

export default TextSizePlugin;