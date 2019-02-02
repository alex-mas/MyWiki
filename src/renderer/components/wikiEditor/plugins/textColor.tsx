import * as React from 'react';
import { RenderMarkProps, RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton, toggleMark } from '../utilities/marks';
import { Value, Editor } from 'slate';
import { ColorPickerButton } from '../components/colorPickerButton';
import { RenderBlock } from '../utilities/blocks';
import { hasInlineType } from '../utilities/inlines';



export const TextColorPlugin = (context: EditorPluginContext) => {

    const renderColoredText = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        return (
            <span
                {...attributes}
                style={{ color: node.data.get("color") }}
                className='wiki-colored-text'
                id="can i give id's alteast?"
            >
                {children}
            </span>
        );
    }
    return {
        id: 'colored-text_plugin',
        renderNode: RenderBlock('colored-text', renderColoredText),
        Button() {
            const isActive = hasInlineType(context.getContent(), 'colored-text');
            return (
                <ColorPickerButton
                    active={isActive}
                    icon='border_color'
                    type='colored-text'
                    context={context}
                />
            )
        }
    }
}

export default TextColorPlugin;